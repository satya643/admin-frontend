"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ImagePlus, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Drawer } from "@/components/ui/Drawer";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { Select } from "@/components/ui/Select";
import { toast } from "sonner";
import { createVariant, deleteVariant, addProductUnit, updateVariantImages } from "@/lib/actions/products";
import { SIZE_OPTIONS } from "@/lib/meta/sizes";
import { VIEW_OPTIONS } from "@/lib/meta/views";
import { VariantImageField } from "./VariantImageField";
import type { ProductVariant } from "@/types/product";
import type { Facility } from "@/types/laundry";

const FIELD_CLASS =
  "w-full rounded-[var(--radius-chip)] border border-rule-strong bg-paper-raised px-3 py-2 text-sm text-ink";
const LABEL_CLASS = "mb-1.5 block text-xs font-medium uppercase tracking-wide text-ink-muted";

function toggleInList(list: string[], value: string): string[] {
  return list.includes(value) ? list.filter((v) => v !== value) : [...list, value];
}

/**
 * Colors (ProductVariant) and their physical stock (GarmentUnit) are
 * managed here, on the product's own page — never through the edit form
 * (see ProductForm) — so a routine "update the price" never risks touching
 * real inventory. Each color is added via POST .../variants, each physical
 * unit via POST .../units against a specific color+size.
 */
export function VariantManager({
  productId,
  variants,
  facilities,
}: {
  productId: string;
  variants: ProductVariant[];
  facilities: Facility[];
}) {
  const router = useRouter();

  const [addVariantOpen, setAddVariantOpen] = useState(false);
  const [newColor, setNewColor] = useState("");
  const [newColorHex, setNewColorHex] = useState("#000000");
  const [newSizes, setNewSizes] = useState<string[]>([]);
  const [isAddingVariant, startAddVariant] = useTransition();

  const [unitVariant, setUnitVariant] = useState<ProductVariant | null>(null);
  const [sku, setSku] = useState("");
  const [unitSize, setUnitSize] = useState("");
  const [facilityId, setFacilityId] = useState(facilities[0]?.id ?? "");
  const [isAddingUnit, startAddUnit] = useTransition();

  const [deleteTarget, setDeleteTarget] = useState<ProductVariant | null>(null);
  const [isDeleting, startDelete] = useTransition();

  const [imagesVariant, setImagesVariant] = useState<ProductVariant | null>(null);
  const [imageUrls, setImageUrls] = useState<Record<string, string>>({});
  const [isSavingImages, startSaveImages] = useTransition();

  function handleAddVariant() {
    if (!newColor.trim() || newSizes.length === 0) {
      toast.error("Color and at least one size are required.");
      return;
    }
    startAddVariant(async () => {
      const result = await createVariant(productId, { color: newColor.trim(), colorHex: newColorHex, sizes: newSizes, isActive: true });
      if (!result.ok) {
        toast.error(result.message);
        return;
      }
      toast.success(`"${result.variant.color}" added.`);
      setNewColor("");
      setNewColorHex("#000000");
      setNewSizes([]);
      setAddVariantOpen(false);
      router.refresh();
    });
  }

  function openUnitDrawer(variant: ProductVariant) {
    setUnitVariant(variant);
    setUnitSize(variant.sizes[0] ?? "");
    setSku("");
  }

  function handleAddUnit() {
    if (!unitVariant || !sku.trim() || !unitSize) {
      toast.error("SKU and size are both required.");
      return;
    }
    startAddUnit(async () => {
      const result = await addProductUnit({
        productId,
        variantId: unitVariant.id,
        sku: sku.trim(),
        size: unitSize,
        facilityId: facilityId || undefined,
      });
      if (!result.ok) {
        toast.error(result.message);
        return;
      }
      toast.success("Unit added.");
      setUnitVariant(null);
      router.refresh();
    });
  }

  function openImagesDrawer(variant: ProductVariant) {
    setImagesVariant(variant);
    setImageUrls(variant.imageUrls);
  }

  function handleSaveImages() {
    if (!imagesVariant) return;
    const cleaned = Object.fromEntries(
      Object.entries(imageUrls)
        .map(([view, url]) => [view, url.trim()])
        .filter(([, url]) => url.length > 0)
    );
    startSaveImages(async () => {
      const result = await updateVariantImages(productId, imagesVariant.id, cleaned);
      if (!result.ok) {
        toast.error(result.message);
        return;
      }
      toast.success(`Images updated for "${imagesVariant.color}".`);
      setImagesVariant(null);
      router.refresh();
    });
  }

  function handleDeleteVariant() {
    if (!deleteTarget) return;
    startDelete(async () => {
      const result = await deleteVariant(productId, deleteTarget.id);
      if (!result.ok) {
        toast.error(result.message);
        setDeleteTarget(null);
        return;
      }
      toast.success(`"${deleteTarget.color}" removed.`);
      setDeleteTarget(null);
      router.refresh();
    });
  }

  return (
    <div className="rounded-[var(--radius-ticket)] border border-rule bg-paper-raised p-4">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="font-display text-base text-ink">Colors</h2>
        <Button variant="secondary" size="sm" onClick={() => setAddVariantOpen(true)}>
          <Plus className="h-3.5 w-3.5" /> Add Another Color
        </Button>
      </div>

      {variants.length === 0 ? (
        <p className="text-sm text-ink-muted">No colors yet.</p>
      ) : (
        <div className="flex flex-col gap-2">
          {variants.map((variant) => (
            <div key={variant.id} className="flex items-center justify-between rounded-[var(--radius-chip)] border border-rule-strong p-3">
              <div className="flex items-center gap-3">
                <span className="h-6 w-6 shrink-0 rounded-full border border-rule" style={{ backgroundColor: variant.colorHex }} />
                <div>
                  <p className="text-sm text-ink">{variant.color}</p>
                  <p className="text-xs text-ink-muted">
                    Sizes: {variant.sizes.length > 0 ? variant.sizes.join(", ") : "none"} · {variant.unitCount} unit(s) ·{" "}
                    {Object.keys(variant.imageUrls).length} image(s)
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Button variant="secondary" size="sm" onClick={() => openImagesDrawer(variant)}>
                  <ImagePlus className="h-3.5 w-3.5" /> Upload Images
                </Button>
                <Button variant="secondary" size="sm" onClick={() => openUnitDrawer(variant)} disabled={variant.sizes.length === 0}>
                  <Plus className="h-3.5 w-3.5" /> Add Unit
                </Button>
                <button
                  type="button"
                  onClick={() => setDeleteTarget(variant)}
                  className="text-ink-muted hover:text-signal-danger"
                  aria-label={`Remove ${variant.color}`}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Drawer open={addVariantOpen} onClose={() => setAddVariantOpen(false)} title="Add a color">
        <div className="flex flex-col gap-4">
          <div>
            <label className={LABEL_CLASS}>Color</label>
            <input value={newColor} onChange={(e) => setNewColor(e.target.value)} className={FIELD_CLASS} placeholder="Blue" />
          </div>
          <div>
            <label className={LABEL_CLASS}>Color Code</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={newColorHex}
                onChange={(e) => setNewColorHex(e.target.value)}
                className="h-9 w-12 rounded-[var(--radius-chip)] border border-rule-strong bg-paper-raised"
              />
              <input value={newColorHex} onChange={(e) => setNewColorHex(e.target.value)} className={FIELD_CLASS} placeholder="#1E40AF" />
            </div>
          </div>
          <div>
            <label className={LABEL_CLASS}>Sizes</label>
            <div className="flex flex-wrap gap-2">
              {SIZE_OPTIONS.map((size) => (
                <label
                  key={size}
                  className="flex cursor-pointer items-center gap-1.5 rounded-[var(--radius-chip)] border border-rule-strong bg-paper-raised px-2.5 py-1.5 text-xs text-ink has-[:checked]:border-brand-gold-deep has-[:checked]:bg-brand-gold-deep/10"
                >
                  <input type="checkbox" checked={newSizes.includes(size)} onChange={() => setNewSizes((prev) => toggleInList(prev, size))} className="h-3.5 w-3.5" />
                  {size}
                </label>
              ))}
            </div>
          </div>
          <Button onClick={handleAddVariant} isLoading={isAddingVariant} disabled={!newColor.trim() || newSizes.length === 0}>
            Add color
          </Button>
        </div>
      </Drawer>

      <Drawer open={unitVariant !== null} onClose={() => setUnitVariant(null)} title={`Add unit — ${unitVariant?.color ?? ""}`}>
        <div className="flex flex-col gap-4">
          <div>
            <label className={LABEL_CLASS}>SKU</label>
            <input value={sku} onChange={(e) => setSku(e.target.value)} className={FIELD_CLASS} placeholder="SHIRT-BLK-M-001" />
          </div>
          <div>
            <label className={LABEL_CLASS}>Size</label>
            <Select value={unitSize} onChange={setUnitSize} options={(unitVariant?.sizes ?? []).map((size) => ({ value: size, label: size }))} />
          </div>
          <div>
            <label className={LABEL_CLASS}>Facility</label>
            <Select
              value={facilityId}
              onChange={setFacilityId}
              options={[{ value: "", label: "Unassigned" }, ...facilities.map((f) => ({ value: f.id, label: `${f.name} (${f.city})` }))]}
            />
          </div>
          <Button onClick={handleAddUnit} isLoading={isAddingUnit} disabled={!sku.trim() || !unitSize}>
            Add unit
          </Button>
        </div>
      </Drawer>

      <Drawer open={imagesVariant !== null} onClose={() => setImagesVariant(null)} title={`Upload images — ${imagesVariant?.color ?? ""}`}>
        <div className="flex flex-col gap-4">
          <p className="text-xs text-ink-muted">Upload a photo for each angle you have. Tap the X to remove one.</p>
          <div className="flex flex-wrap gap-3">
            {VIEW_OPTIONS.map((view) => (
              <VariantImageField
                key={view.value}
                label={view.label}
                url={imageUrls[view.value] ?? ""}
                onChange={(url) => setImageUrls((prev) => ({ ...prev, [view.value]: url }))}
              />
            ))}
          </div>
          <Button onClick={handleSaveImages} isLoading={isSavingImages}>
            Save images
          </Button>
        </div>
      </Drawer>

      <ConfirmDialog
        open={deleteTarget !== null}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteVariant}
        title="Remove this color?"
        description={
          deleteTarget
            ? `This removes "${deleteTarget.color}" entirely. Refused if it still has physical units in circulation.`
            : ""
        }
        confirmLabel="Remove"
        danger
        isLoading={isDeleting}
      />
    </div>
  );
}
