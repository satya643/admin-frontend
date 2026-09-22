import Link from "next/link";
import { PageHeader } from "@/components/ui/PageHeader";
import { DataTable, type Column } from "@/components/ui/DataTable";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Button } from "@/components/ui/Button";
import { DeliveryFilters } from "@/components/delivery/DeliveryFilters";
import { DeliveryJobActions } from "@/components/delivery/DeliveryJobActions";
import { listDeliveryJobs, listCouriers } from "@/lib/data/delivery";
import { DELIVERY_STATUS_META } from "@/lib/meta/delivery-status";
import { formatDateTime } from "@/lib/utils/format";
import type { DeliveryJob, DeliveryStatus, DeliveryType } from "@/types/delivery";

export default async function DeliveryPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; type?: string }>;
}) {
  const params = await searchParams;
  const status = (params.status as DeliveryStatus | "all" | undefined) ?? "all";
  const type = (params.type as DeliveryType | "all" | undefined) ?? "all";

  const [jobs, couriers] = await Promise.all([listDeliveryJobs({ status, type }), listCouriers()]);

  const columns: Column<DeliveryJob>[] = [
    { key: "id", header: "Job", render: (j) => <span className="font-mono text-ink">{j.id}</span> },
    { key: "order", header: "Order", render: (j) => <Link href={`/orders/${j.orderId}`} className="text-ink hover:underline">{j.orderId}</Link> },
    { key: "type", header: "Type", render: (j) => <span className="capitalize text-ink-muted">{j.type}</span> },
    { key: "customer", header: "Customer", render: (j) => <span className="text-ink">{j.customer}</span> },
    { key: "zone", header: "Zone", render: (j) => <span className="text-ink-muted">{j.zone}</span> },
    { key: "window", header: "Window", render: (j) => <span className="text-xs text-ink-muted">{formatDateTime(j.windowStart)}</span> },
    { key: "status", header: "Status", render: (j) => <StatusBadge label={DELIVERY_STATUS_META[j.status].label} tone={DELIVERY_STATUS_META[j.status].tone} /> },
    { key: "actions", header: "", render: (j) => <DeliveryJobActions job={j} couriers={couriers} /> },
  ];

  return (
    <>
      <PageHeader
        title="Delivery Jobs"
        description="Pickup and dropoff jobs across all active orders"
        actions={
          <Link href="/delivery/couriers">
            <Button variant="secondary" size="sm">
              Couriers
            </Button>
          </Link>
        }
      />

      <DeliveryFilters />

      <DataTable columns={columns} rows={jobs} rowKey={(j) => j.id} emptyTitle="No delivery jobs found" />
    </>
  );
}
