"use client";

import { useState, useTransition, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import { toast } from "sonner";
import { createProduct, updateProduct, createVariant, updateVariant as updateVariantAction } from "@/lib/actions/products";
import { createCategory } from "@/lib/actions/categories";
import { SIZE_OPTIONS } from "@/lib/meta/sizes";
import { VIEW_OPTIONS } from "@/lib/meta/views";
import { VariantImageField } from "./VariantImageField";
import type { Measurement, Product, ProductFormInput, ProductVariantInput } from "@/types/product";
import type { Category } from "@/types/category";

const FIELD_CLASS =
  "w-full rounded-[var(--radius-chip)] border border-rule-strong bg-paper-raised px-3 py-2 text-sm text-ink";
const LABEL_CLASS = "mb-1.5 block text-xs font-medium uppercase tracking-wide text-ink-muted";

// Fixed, backend-validated lists (see console/products/schemas.ts on the
// backend) — free text here would just fail validation, so these render as
// checkboxes instead of a text field.
const OCCASIONS = ["Wedding", "Party", "Office", "Date Night", "Festival", "Travel", "Everyday"];
const STYLES = ["Minimal", "Classic", "Street", "Formal", "Traditional", "Contemporary"];

function splitList(value: FormDataEntryValue | null): string[] {
  return String(value ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

function toggleInList(list: string[], value: string): string[] {
  return list.includes(value) ? list.filter((v) => v !== value) : [...list, value];
}

function CheckboxGrid({ options, selected, onToggle }: { options: string[]; selected: string[]; onToggle: (value: string) => void }) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((option) => (
        <label
          key={option}
          className="flex cursor-pointer items-center gap-1.5 rounded-[var(--radius-chip)] border border-rule-strong bg-paper-raised px-2.5 py-1.5 text-xs text-ink has-[:checked]:border-brand-gold-deep has-[:checked]:bg-brand-gold-deep/10"
        >
          <input type="checkbox" checked={selected.includes(option)} onChange={() => onToggle(option)} className="h-3.5 w-3.5" />
          {option}
        </label>
      ))}
    </div>
  );
}

interface VariantDraft {
  key: string;
  /** Set for a variant that already exists in the DB (edit mode, pre-filled
   * from `product.variants`) — submit PATCHes it via updateVariantAction.
   * Undefined for a row added with "+ Add Another Color" that doesn't exist
   * yet — submit POSTs it via createVariant. Distinguishes the two so
   * submit knows which call to make per row. */
  id?: string;
  color: string;
  colorHex: string;
  sizes: string[];
  imageUrls: Record<string, string>;
}

let variantKeySeq = 0;
function newVariantDraft(): VariantDraft {
  variantKeySeq += 1;
  return { key: `v${variantKeySeq}`, color: "", colorHex: "#000000", sizes: [], imageUrls: {} };
}

function draftsFromProduct(product: Product): VariantDraft[] {
  return product.variants.map((v) => ({
    key: v.id,
    id: v.id,
    color: v.color,
    colorHex: v.colorHex,
    sizes: v.sizes,
    imageUrls: v.imageUrls,
  }));
}

/**
 * One form for both create and edit, with the same variant editor (color,
 * color code, sizes, images) in both — editing a product lets you change
 * every field, including its existing colors' images, not just name/price.
 * An existing color's row (has `id`) still can't be deleted from here
 * though: that goes through the guarded deleteVariant on the product detail
 * page, which refuses while the color has real inventory. Removing a row
 * here only removes one that was just added and never saved (no `id` yet).
 */
export function ProductForm({ product, categories: initialCategories }: { product?: Product; categories: Category[] }) {
  const router = useRouter();
  const [isSubmitting, startTransition] = useTransition();

  const [categories, setCategories] = useState(initialCategories);
  const [categoryId, setCategoryId] = useState(product?.categoryId ?? categories[0]?.id ?? "");
  const [newCategoryOpen, setNewCategoryOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [isAddingCategory, startAddCategory] = useTransition();

  const [occasions, setOccasions] = useState<string[]>(product?.occasions ?? []);
  const [styles, setStyles] = useState<string[]>(product?.styles ?? []);

  const [coverImageUrl, setCoverImageUrl] = useState(product?.coverImageUrl ?? "");
  const [measurements, setMeasurements] = useState<Measurement[]>(
    product ? Object.entries(product.measurements).map(([label, value]) => ({ label, value: String(value) })) : []
  );

  const [variants, setVariants] = useState<VariantDraft[]>(product ? draftsFromProduct(product) : [newVariantDraft()]);

  function handleAddCategory() {
    const name = newCategoryName.trim();
    if (!name) return;
    startAddCategory(async () => {
      const result = await createCategory({ name, isActive: true });
      if (!result.ok) {
        toast.error(result.message);
        return;
      }
      setCategories((prev) => [...prev, result.category].sort((a, b) => a.name.localeCompare(b.name)));
      setCategoryId(result.category.id);
      setNewCategoryName("");
      setNewCategoryOpen(false);
      toast.success(`Category "${result.category.name}" created.`);
    });
  }

  function patchVariantDraft(key: string, patch: Partial<VariantDraft>) {
    setVariants((rows) => rows.map((row) => (row.key === key ? { ...row, ...patch } : row)));
  }

  function patchMeasurement(index: number, patch: Partial<Measurement>) {
    setMeasurements((rows) => rows.map((row, i) => (i === index ? { ...row, ...patch } : row)));
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!categoryId) {
      toast.error("Select a category.");
      return;
    }

    const data = new FormData(event.currentTarget);
    const base: ProductFormInput = {
      name: String(data.get("name") ?? "").trim(),
      brand: String(data.get("brand") ?? "").trim(),
      categoryId,
      fabric: String(data.get("fabric") ?? "").trim(),
      occasions,
      styles,
      care: splitList(data.get("care")),
      rentPricePaise: Math.round(Number(data.get("rentPrice") ?? 0) * 100),
      rentDays: Number(data.get("rentDays") ?? 0),
      buyPricePaise: Math.round(Number(data.get("buyPrice") ?? 0) * 100),
      depositPaise: Math.round(Number(data.get("deposit") ?? 0) * 100),
      deliveryDays: Number(data.get("deliveryDays") ?? 0),
      isActive: data.get("isActive") === "on",
      description: String(data.get("description") ?? "").trim(),
      conditionCopy: String(data.get("conditionCopy") ?? "").trim() || "Excellent condition, inspected before dispatch",
      coverImageUrl: coverImageUrl.trim() || undefined,
      measurements: measurements
        .map((m) => ({ label: m.label.trim(), value: m.value.trim() }))
        .filter((m) => m.label && m.value),
    };

    const cleanDrafts = variants
      .filter((v) => v.color.trim())
      .map((v) => ({
        ...v,
        color: v.color.trim(),
        imageUrls: Object.fromEntries(Object.entries(v.imageUrls).filter(([, url]) => url.trim().length > 0)),
      }));

    if (cleanDrafts.length === 0) {
      toast.error("Add at least one color — every product needs at least one variant.");
      return;
    }
    if (cleanDrafts.some((v) => v.sizes.length === 0)) {
      toast.error("Every color needs at least one size selected.");
      return;
    }

    startTransition(async () => {
      if (product) {
        const productResult = await updateProduct(product.id, base);
        if (!productResult.ok) {
          toast.error(productResult.message);
          return;
        }

        // Existing colors (have an id) are PATCHed; a row added here with
        // "+ Add Another Color" (no id yet) is POSTed as a new one.
        const variantResults = await Promise.all(
          cleanDrafts.map((draft) => {
            const input: ProductVariantInput = { color: draft.color, colorHex: draft.colorHex, sizes: draft.sizes, isActive: true, imageUrls: draft.imageUrls };
            return draft.id ? updateVariantAction(product.id, draft.id, input) : createVariant(product.id, input);
          })
        );
        const failed = variantResults.filter((r) => !r.ok) as { ok: false; message: string }[];
        if (failed.length > 0) {
          toast.error(failed.map((f) => f.message).join("; "));
          return;
        }

        toast.success("Product updated.");
        router.push(`/products/${product.id}`);
        return;
      }

      const newVariants: ProductVariantInput[] = cleanDrafts.map((v) => ({
        color: v.color,
        colorHex: v.colorHex,
        sizes: v.sizes,
        isActive: true,
        imageUrls: v.imageUrls,
      }));
      const result = await createProduct({ ...base, variants: newVariants });
      if (!result.ok) {
        toast.error(result.message);
        return;
      }
      toast.success("Product created.");
      router.push(`/products/${result.id}`);
    });
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-6">
      <div className="grid gap-4 rounded-[var(--radius-ticket)] border border-rule bg-paper-raised p-4 sm:grid-cols-2">
        <div>
          <label className={LABEL_CLASS}>Name</label>
          <input name="name" required defaultValue={product?.name} className={FIELD_CLASS} placeholder="Premium Linen Shirt" />
        </div>
        <div>
          <label className={LABEL_CLASS}>Brand</label>
          <input name="brand" required defaultValue={product?.brand} className={FIELD_CLASS} placeholder="Vestige" />
        </div>
        <div>
          <label className={LABEL_CLASS}>Category</label>
          <div className="flex gap-2">
            <Select
              value={categoryId}
              onChange={setCategoryId}
              options={categories.map((c) => ({ value: c.id, label: c.name }))}
              placeholder="No categories yet"
              className="flex-1"
            />
            <Button type="button" variant="secondary" size="sm" onClick={() => setNewCategoryOpen((v) => !v)}>
              <Plus className="h-3.5 w-3.5" />
            </Button>
          </div>
          {newCategoryOpen ? (
            <div className="mt-2 flex gap-2">
              <input
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                placeholder="New category name"
                className={FIELD_CLASS}
              />
              <Button type="button" size="sm" onClick={handleAddCategory} isLoading={isAddingCategory}>
                Add
              </Button>
            </div>
          ) : null}
        </div>
        <div>
          <label className={LABEL_CLASS}>Fabric (what it&apos;s made of)</label>
          <input name="fabric" required defaultValue={product?.fabric} className={FIELD_CLASS} placeholder="Linen" />
        </div>
      </div>

      <div className="grid gap-4 rounded-[var(--radius-ticket)] border border-rule bg-paper-raised p-4 sm:grid-cols-2">
        <div>
          <label className={LABEL_CLASS}>Cover Image</label>
          <p className="mb-2 text-xs text-ink-muted">
            Shown on cart lines and product cards as a quick preview, before a customer picks a color — falls back to a
            color-specific photo if that color has one.
          </p>
          <VariantImageField label="Cover" url={coverImageUrl} onChange={setCoverImageUrl} />
        </div>
        <div>
          <label className={LABEL_CLASS}>Description</label>
          <textarea
            name="description"
            defaultValue={product?.description}
            rows={5}
            className={FIELD_CLASS}
            placeholder="What makes this piece worth renting — fit, feel, occasion, styling notes."
          />
        </div>
      </div>

      <div className="grid gap-4 rounded-[var(--radius-ticket)] border border-rule bg-paper-raised p-4">
        <div>
          <label className={LABEL_CLASS}>Occasions</label>
          <CheckboxGrid options={OCCASIONS} selected={occasions} onToggle={(v) => setOccasions((prev) => toggleInList(prev, v))} />
        </div>
        <div>
          <label className={LABEL_CLASS}>Styles</label>
          <CheckboxGrid options={STYLES} selected={styles} onToggle={(v) => setStyles((prev) => toggleInList(prev, v))} />
        </div>
      </div>

      <div className="grid gap-4 rounded-[var(--radius-ticket)] border border-rule bg-paper-raised p-4 sm:grid-cols-3">
        <div>
          <label className={LABEL_CLASS}>Rent Price (₹)</label>
          <input
            name="rentPrice"
            required
            type="number"
            min={0}
            defaultValue={product ? product.rentPricePaise / 100 : undefined}
            className={FIELD_CLASS}
            placeholder="499"
          />
        </div>
        <div>
          <label className={LABEL_CLASS}>Rent Days</label>
          <input name="rentDays" required type="number" min={1} defaultValue={product?.rentDays} className={FIELD_CLASS} placeholder="3" />
        </div>
        <div>
          <label className={LABEL_CLASS}>Deposit (₹)</label>
          <input
            name="deposit"
            required
            type="number"
            min={0}
            defaultValue={product ? product.depositPaise / 100 : undefined}
            className={FIELD_CLASS}
            placeholder="500"
          />
        </div>
        <div>
          <label className={LABEL_CLASS}>Buy Price (₹)</label>
          <input
            name="buyPrice"
            required
            type="number"
            min={0}
            defaultValue={product ? product.buyPricePaise / 100 : undefined}
            className={FIELD_CLASS}
            placeholder="1499"
          />
        </div>
        <div>
          <label className={LABEL_CLASS}>Delivery Days</label>
          <input
            name="deliveryDays"
            required
            type="number"
            min={0}
            defaultValue={product?.deliveryDays}
            className={FIELD_CLASS}
            placeholder="2"
          />
        </div>
        <div className="flex items-end gap-2 pb-2">
          <input id="isActive" name="isActive" type="checkbox" defaultChecked={product?.isActive ?? true} className="h-4 w-4" />
          <label htmlFor="isActive" className="text-sm text-ink">
            Active (visible to customers)
          </label>
        </div>
      </div>

      <div className="grid gap-4 rounded-[var(--radius-ticket)] border border-rule bg-paper-raised p-4 sm:grid-cols-2">
        <div>
          <label className={LABEL_CLASS}>Care Instructions (comma-separated)</label>
          <input name="care" defaultValue={product?.care.join(", ")} className={FIELD_CLASS} placeholder="Dry clean only" />
        </div>
        <div>
          <label className={LABEL_CLASS}>Quality / Condition Note</label>
          <input
            name="conditionCopy"
            defaultValue={product?.conditionCopy ?? "Excellent condition, inspected before dispatch"}
            className={FIELD_CLASS}
            placeholder="Excellent condition, inspected before dispatch"
          />
        </div>
      </div>

      <div className="flex flex-col gap-3 rounded-[var(--radius-ticket)] border border-rule bg-paper-raised p-4">
        <div className="flex items-center justify-between">
          <label className={LABEL_CLASS + " mb-0"}>Measurements</label>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => setMeasurements((rows) => [...rows, { label: "", value: "" }])}
          >
            <Plus className="h-3.5 w-3.5" /> Add Measurement
          </Button>
        </div>
        {measurements.length === 0 ? (
          <p className="text-sm text-ink-muted">No measurements yet — e.g. Chest: 40in, Length: 28in.</p>
        ) : (
          measurements.map((m, index) => (
            <div key={index} className="flex items-center gap-2">
              <input
                value={m.label}
                onChange={(e) => patchMeasurement(index, { label: e.target.value })}
                className={FIELD_CLASS}
                placeholder="Chest"
              />
              <input
                value={m.value}
                onChange={(e) => patchMeasurement(index, { value: e.target.value })}
                className={FIELD_CLASS}
                placeholder="40in"
              />
              <button
                type="button"
                onClick={() => setMeasurements((rows) => rows.filter((_, i) => i !== index))}
                className="shrink-0 text-ink-muted hover:text-signal-danger"
                aria-label="Remove measurement"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          ))
        )}
      </div>

      <div className="flex flex-col gap-4 rounded-[var(--radius-ticket)] border border-rule bg-paper-raised p-4">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-base text-ink">Product Variants</h2>
          <p className="text-xs text-ink-muted">One row per color this product comes in.</p>
        </div>

        {variants.map((variant, index) => (
          <div key={variant.key} className="flex flex-col gap-3 rounded-[var(--radius-chip)] border border-rule-strong p-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium uppercase tracking-wide text-ink-muted">Variant {index + 1}</span>
              {!variant.id ? (
                <button
                  type="button"
                  onClick={() => setVariants((rows) => rows.filter((r) => r.key !== variant.key))}
                  className="text-ink-muted hover:text-signal-danger"
                  title="Remove this not-yet-saved color"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              ) : (
                <span className="text-[10px] uppercase tracking-wide text-ink-muted" title="Remove an existing color from the product's detail page instead — it checks for real inventory first.">
                  Saved
                </span>
              )}
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className={LABEL_CLASS}>Color</label>
                <input
                  value={variant.color}
                  onChange={(e) => patchVariantDraft(variant.key, { color: e.target.value })}
                  className={FIELD_CLASS}
                  placeholder="Black"
                />
              </div>
              <div>
                <label className={LABEL_CLASS}>Color Code</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={variant.colorHex}
                    onChange={(e) => patchVariantDraft(variant.key, { colorHex: e.target.value })}
                    className="h-9 w-12 rounded-[var(--radius-chip)] border border-rule-strong bg-paper-raised"
                  />
                  <input
                    value={variant.colorHex}
                    onChange={(e) => patchVariantDraft(variant.key, { colorHex: e.target.value })}
                    className={FIELD_CLASS}
                    placeholder="#000000"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className={LABEL_CLASS}>Sizes</label>
              <CheckboxGrid
                options={SIZE_OPTIONS}
                selected={variant.sizes}
                onToggle={(size) => patchVariantDraft(variant.key, { sizes: toggleInList(variant.sizes, size) })}
              />
            </div>

            <div>
              <label className={LABEL_CLASS}>Images (optional)</label>
              <div className="flex flex-wrap gap-3">
                {VIEW_OPTIONS.map((view) => (
                  <VariantImageField
                    key={view.value}
                    label={view.label}
                    url={variant.imageUrls[view.value] ?? ""}
                    onChange={(url) =>
                      patchVariantDraft(variant.key, { imageUrls: { ...variant.imageUrls, [view.value]: url } })
                    }
                  />
                ))}
              </div>
            </div>
          </div>
        ))}

        <Button type="button" variant="secondary" size="sm" onClick={() => setVariants((rows) => [...rows, newVariantDraft()])} className="self-start">
          <Plus className="h-3.5 w-3.5" /> Add Another Color
        </Button>
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="secondary" onClick={() => router.push("/products")}>
          Cancel
        </Button>
        <Button type="submit" isLoading={isSubmitting}>
          {product ? "Save Changes" : "Create Product"}
        </Button>
      </div>
    </form>
  );
}
