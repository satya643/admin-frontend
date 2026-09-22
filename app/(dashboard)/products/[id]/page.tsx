import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { DataTable, type Column } from "@/components/ui/DataTable";
import { ProductActions } from "@/components/products/ProductActions";
import { VariantManager } from "@/components/products/VariantManager";
import { getProduct } from "@/lib/data/products";
import { listGarmentUnits } from "@/lib/data/inventory";
import { listFacilities } from "@/lib/data/laundry";
import { STAGE_META } from "@/lib/meta/stage";
import { formatPaise } from "@/lib/utils/format";
import type { GarmentUnitListItem } from "@/types/garment-unit";

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await getProduct(id);
  if (!product) notFound();

  const [units, facilities] = await Promise.all([listGarmentUnits({ pageSize: 100 }), listFacilities()]);
  const productUnits = units.items.filter((unit) => unit.product.id === product.id);

  const columns: Column<GarmentUnitListItem>[] = [
    { key: "sku", header: "SKU", render: (u) => <Link href={`/inventory/${u.id}`} className="font-mono text-ink hover:underline">{u.sku}</Link> },
    { key: "color", header: "Color", render: (u) => u.color },
    { key: "size", header: "Size", render: (u) => u.size },
    { key: "stage", header: "Stage", render: (u) => <StatusBadge label={STAGE_META[u.stage].label} tone={STAGE_META[u.stage].tone} /> },
    { key: "condition", header: "Condition", render: (u) => <span className="capitalize text-ink-muted">{u.condition.replace("_", " ")}</span> },
    { key: "rented", header: "Times Rented", render: (u) => <span className="font-mono tabular-nums">{u.timesRented}</span> },
  ];

  return (
    <>
      <Link href="/products" className="flex w-fit items-center gap-1.5 text-sm text-ink-muted hover:text-ink">
        <ArrowLeft className="h-3.5 w-3.5" /> Back to Products
      </Link>

      <PageHeader
        title={product.name}
        description={`${product.brand} · ${product.category}`}
        actions={<ProductActions productId={product.id} productName={product.name} isActive={product.isActive} />}
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-[var(--radius-ticket)] border border-rule bg-paper-raised p-4 lg:col-span-2">
          <div className="mb-4 flex gap-4">
            {product.coverImageUrl ? (
              /* eslint-disable-next-line @next/next/no-img-element -- arbitrary uploaded URL, not a next/image-configured domain */
              <img
                src={product.coverImageUrl}
                alt={`${product.name} cover`}
                className="h-24 w-20 shrink-0 rounded-[var(--radius-chip)] border border-rule object-cover"
              />
            ) : null}
            <div className="min-w-0">
              <h2 className="mb-1 font-display text-base text-ink">Details</h2>
              {product.description ? <p className="text-sm text-ink-muted">{product.description}</p> : null}
            </div>
          </div>

          <dl className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm sm:grid-cols-3">
            <Field label="Rent Price" value={formatPaise(product.rentPricePaise)} />
            <Field label="Rent Days" value={`${product.rentDays} days`} />
            <Field label="Buy Price" value={formatPaise(product.buyPricePaise)} />
            <Field label="Deposit" value={formatPaise(product.depositPaise)} />
            <Field label="Delivery" value={`${product.deliveryDays} day(s)`} />
            <Field label="Fabric" value={product.fabric} />
            <Field label="Colors" value={`${product.variants.length}`} />
            <Field label="Status" value={product.isActive ? "Active" : "Inactive"} />
            <Field label="Quality / Condition" value={product.conditionCopy} />
          </dl>

          <div className="mt-4 flex flex-wrap gap-1.5">
            {product.occasions.map((occasion) => (
              <span key={occasion} className="rounded-[var(--radius-chip)] bg-ink/[0.06] px-2 py-1 text-xs text-ink-muted">
                {occasion}
              </span>
            ))}
            {product.styles.map((style) => (
              <span key={style} className="rounded-[var(--radius-chip)] bg-brand-gold-deep/10 px-2 py-1 text-xs text-ink-muted">
                {style}
              </span>
            ))}
          </div>

          {Object.keys(product.measurements).length > 0 ? (
            <div className="mt-4 border-t border-rule pt-4">
              <h3 className="mb-2 text-xs font-medium uppercase tracking-wide text-ink-muted">Measurements</h3>
              <dl className="grid grid-cols-3 gap-3 text-sm">
                {Object.entries(product.measurements).map(([key, value]) => (
                  <Field key={key} label={key} value={String(value)} />
                ))}
              </dl>
            </div>
          ) : null}
        </div>

        <div className="rounded-[var(--radius-ticket)] border border-rule bg-paper-raised p-4">
          <h2 className="mb-3 font-display text-base text-ink">Care</h2>
          <ul className="list-inside list-disc text-sm text-ink-muted">
            {product.care.map((instruction) => (
              <li key={instruction}>{instruction}</li>
            ))}
          </ul>
        </div>
      </div>

      <VariantManager productId={product.id} variants={product.variants} facilities={facilities} />

      <div>
        <h2 className="mb-3 font-display text-base text-ink">Garment Units ({productUnits.length})</h2>
        <DataTable columns={columns} rows={productUnits} rowKey={(u) => u.id} emptyTitle="No units for this product" />
      </div>
    </>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs uppercase tracking-wide text-ink-muted">{label}</dt>
      <dd className="mt-0.5 text-ink">{value}</dd>
    </div>
  );
}
