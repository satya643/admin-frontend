import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { DataTable, type Column } from "@/components/ui/DataTable";
import { NewCourierDrawer } from "@/components/delivery/NewCourierDrawer";
import { listCouriers } from "@/lib/data/delivery";
import type { Courier } from "@/types/delivery";

export default async function CouriersPage() {
  const couriers = await listCouriers();

  const columns: Column<Courier>[] = [
    { key: "name", header: "Courier", render: (c) => <span className="text-ink">{c.name}</span> },
    {
      key: "zones",
      header: "Zones",
      render: (c) => (
        <div className="flex flex-wrap gap-1">
          {c.zones.map((zone) => (
            <span key={zone} className="rounded-[var(--radius-chip)] bg-ink/[0.06] px-2 py-0.5 text-xs text-ink-muted">
              {zone}
            </span>
          ))}
        </div>
      ),
    },
  ];

  return (
    <>
      <Link href="/delivery" className="flex w-fit items-center gap-1.5 text-sm text-ink-muted hover:text-ink">
        <ArrowLeft className="h-3.5 w-3.5" /> Back to Delivery
      </Link>

      <PageHeader
        title="Couriers"
        description="Delivery personnel and the zones they cover"
        actions={<NewCourierDrawer />}
      />

      <DataTable columns={columns} rows={couriers} rowKey={(c) => c.id} emptyTitle="No couriers found" />
    </>
  );
}
