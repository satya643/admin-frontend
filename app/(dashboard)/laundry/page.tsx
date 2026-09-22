import Link from "next/link";
import { PageHeader } from "@/components/ui/PageHeader";
import { DataTable, type Column } from "@/components/ui/DataTable";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { NewBatchDrawer } from "@/components/laundry/NewBatchDrawer";
import { AdvanceButton } from "@/components/laundry/AdvanceButton";
import { listLaundryBatches, listFacilities } from "@/lib/data/laundry";
import { listGarmentUnits } from "@/lib/data/inventory";
import { LAUNDRY_STAGE_META } from "@/lib/meta/laundry-stage";
import { formatDateTime } from "@/lib/utils/format";
import type { LaundryBatch } from "@/types/laundry";

export default async function LaundryPage() {
  const [batches, facilities, laundryUnits] = await Promise.all([
    listLaundryBatches(),
    listFacilities(),
    listGarmentUnits({ stage: "laundry", pageSize: 100 }),
  ]);

  const columns: Column<LaundryBatch>[] = [
    { key: "id", header: "Batch", render: (b) => <Link href={`/laundry/${b.id}`} className="font-mono text-ink hover:underline">{b.id}</Link> },
    { key: "facility", header: "Facility", render: (b) => <span className="text-ink-muted">{facilities.find((f) => f.id === b.facilityId)?.name ?? b.facilityId}</span> },
    { key: "priority", header: "Priority", render: (b) => <span className="capitalize text-ink-muted">{b.priority}</span> },
    { key: "count", header: "Garments", render: (b) => <span className="font-mono tabular-nums">{b.garmentCount}</span> },
    { key: "eta", header: "ETA", render: (b) => <span className="text-ink-muted">{b.etaMinutes > 0 ? `${b.etaMinutes} min` : "Due"}</span> },
    { key: "started", header: "Started", render: (b) => <span className="text-xs text-ink-muted">{formatDateTime(b.startedAt)}</span> },
    { key: "stage", header: "Stage", render: (b) => <StatusBadge label={LAUNDRY_STAGE_META[b.stage].label} tone={LAUNDRY_STAGE_META[b.stage].tone} /> },
    { key: "actions", header: "", render: (b) => <AdvanceButton batchId={b.id} stage={b.stage} /> },
  ];

  return (
    <>
      <PageHeader
        title="Laundry"
        description="Batches moving through wash, dry, press and quality check"
        actions={<NewBatchDrawer facilities={facilities} laundryUnits={laundryUnits.items} />}
      />

      <DataTable columns={columns} rows={batches} rowKey={(b) => b.id} emptyTitle="No laundry batches" />
    </>
  );
}
