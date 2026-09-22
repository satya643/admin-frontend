import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { TransitionPanel } from "@/components/inventory/TransitionPanel";
import { getGarmentUnit, allowedNextStages } from "@/lib/data/inventory";
import { STAGE_META } from "@/lib/meta/stage";
import { formatDateTime } from "@/lib/utils/format";

export default async function GarmentUnitDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const unit = await getGarmentUnit(id);
  if (!unit) notFound();

  return (
    <>
      <Link href="/inventory" className="flex w-fit items-center gap-1.5 text-sm text-ink-muted hover:text-ink">
        <ArrowLeft className="h-3.5 w-3.5" /> Back to Inventory
      </Link>

      <PageHeader title={unit.sku} description={`${unit.product.name} · ${unit.product.brand} · Size ${unit.size}`} />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-[var(--radius-ticket)] border border-rule bg-paper-raised p-4 lg:col-span-2">
          <h2 className="mb-3 font-display text-base text-ink">Details</h2>
          <dl className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm sm:grid-cols-3">
            <Field label="Condition" value={unit.condition.replace("_", " ")} />
            <Field label="Last Moved" value={formatDateTime(unit.lastMovedAt)} />
            <Field label="Times Rented" value={String(unit.timesRented)} />
            <Field label="Facility" value={unit.facilityId ?? "—"} />
          </dl>

          {unit.currentOrder ? (
            <div className="mt-4 border-t border-rule pt-4">
              <h3 className="mb-2 text-xs font-medium uppercase tracking-wide text-ink-muted">Current Order</h3>
              <Link href={`/orders/${unit.currentOrder.id}`} className="font-mono text-sm text-ink hover:underline">
                {unit.currentOrder.id}
              </Link>
              <p className="text-sm text-ink-muted">{unit.currentOrder.customer.name}</p>
            </div>
          ) : null}

          <div className="mt-4 border-t border-rule pt-4">
            <h3 className="mb-2 text-xs font-medium uppercase tracking-wide text-ink-muted">Stage History</h3>
            <ul className="space-y-2">
              {unit.stageTransitions.map((transition) => (
                <li key={transition.id} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    {transition.fromStage ? (
                      <>
                        <StatusBadge label={STAGE_META[transition.fromStage].label} tone={STAGE_META[transition.fromStage].tone} />
                        <span className="text-ink-muted">→</span>
                      </>
                    ) : null}
                    <StatusBadge label={STAGE_META[transition.toStage].label} tone={STAGE_META[transition.toStage].tone} />
                  </div>
                  <span className="text-xs text-ink-muted">{formatDateTime(transition.occurredAt)}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <TransitionPanel unitId={unit.id} currentStage={unit.stage} allowedNext={allowedNextStages(unit.stage)} />
      </div>
    </>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs uppercase tracking-wide text-ink-muted">{label}</dt>
      <dd className="mt-0.5 capitalize text-ink">{value}</dd>
    </div>
  );
}
