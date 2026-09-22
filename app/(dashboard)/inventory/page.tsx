import Link from "next/link";
import { PageHeader } from "@/components/ui/PageHeader";
import { DataTable, type Column } from "@/components/ui/DataTable";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { UrlPagination } from "@/components/ui/UrlPagination";
import { LifecycleStrip } from "@/components/inventory/LifecycleStrip";
import { InventoryFilters } from "@/components/inventory/InventoryFilters";
import { listGarmentUnits, getLifecycleCounts } from "@/lib/data/inventory";
import { STAGE_META } from "@/lib/meta/stage";
import { formatDate } from "@/lib/utils/format";
import type { GarmentStage, GarmentUnitListItem } from "@/types/garment-unit";

export default async function InventoryPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; q?: string; stage?: string }>;
}) {
  const params = await searchParams;
  const page = Number(params.page ?? "1");
  const stage = (params.stage as GarmentStage | "all" | undefined) ?? "all";

  const [result, counts] = await Promise.all([
    listGarmentUnits({ page, pageSize: 10, q: params.q, stage }),
    getLifecycleCounts(),
  ]);

  const columns: Column<GarmentUnitListItem>[] = [
    {
      key: "sku",
      header: "SKU",
      render: (u) => (
        <Link href={`/inventory/${u.id}`} className="font-mono text-ink hover:underline">
          {u.sku}
        </Link>
      ),
    },
    {
      key: "product",
      header: "Product",
      render: (u) => (
        <div>
          <p className="text-ink">{u.product.name}</p>
          <p className="text-xs text-ink-muted">{u.product.brand} · Size {u.size}</p>
        </div>
      ),
    },
    { key: "stage", header: "Stage", render: (u) => <StatusBadge label={STAGE_META[u.stage].label} tone={STAGE_META[u.stage].tone} /> },
    { key: "condition", header: "Condition", render: (u) => <span className="capitalize text-ink-muted">{u.condition.replace("_", " ")}</span> },
    { key: "lastMoved", header: "Last Moved", render: (u) => <span className="text-ink-muted">{formatDate(u.lastMovedAt)}</span> },
    { key: "rented", header: "Times Rented", render: (u) => <span className="font-mono tabular-nums">{u.timesRented}</span> },
  ];

  return (
    <>
      <PageHeader title="Inventory" description="Every physical garment unit and its lifecycle stage" />

      <LifecycleStrip counts={counts} activeStage={stage !== "all" ? stage : undefined} />

      <InventoryFilters />

      <div>
        <DataTable
          columns={columns}
          rows={result.items}
          rowKey={(u) => u.id}
          emptyTitle="No garment units found"
          emptyDescription="Try a different search or stage filter."
        />
        <UrlPagination page={result.page} totalPages={result.totalPages} total={result.total} pageSize={result.pageSize} />
      </div>
    </>
  );
}
