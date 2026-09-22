import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { AdvanceButton } from "@/components/laundry/AdvanceButton";
import { getLaundryBatch, listFacilities } from "@/lib/data/laundry";
import { LAUNDRY_STAGE_META, LAUNDRY_STAGE_ORDER } from "@/lib/meta/laundry-stage";
import { formatDateTime } from "@/lib/utils/format";

export default async function LaundryBatchDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [batch, facilities] = await Promise.all([getLaundryBatch(id), listFacilities()]);
  if (!batch) notFound();

  const facility = facilities.find((f) => f.id === batch.facilityId);
  const currentIndex = LAUNDRY_STAGE_ORDER.indexOf(batch.stage);

  return (
    <>
      <Link href="/laundry" className="flex w-fit items-center gap-1.5 text-sm text-ink-muted hover:text-ink">
        <ArrowLeft className="h-3.5 w-3.5" /> Back to Laundry
      </Link>

      <PageHeader title={batch.id} description={`${facility?.name ?? batch.facilityId} · ${batch.garmentCount} garments`} />

      <div className="rounded-[var(--radius-ticket)] border border-rule bg-paper-raised p-4">
        <h2 className="mb-4 font-display text-base text-ink">Progress</h2>
        <div className="flex flex-wrap items-center gap-2">
          {LAUNDRY_STAGE_ORDER.map((stage, index) => (
            <div key={stage} className="flex items-center gap-2">
              <StatusBadge
                label={LAUNDRY_STAGE_META[stage].label}
                tone={index <= currentIndex ? LAUNDRY_STAGE_META[stage].tone : "neutral"}
              />
              {index < LAUNDRY_STAGE_ORDER.length - 1 ? <span className="text-ink-muted">→</span> : null}
            </div>
          ))}
        </div>

        <dl className="mt-5 grid grid-cols-2 gap-4 border-t border-rule pt-4 text-sm sm:grid-cols-4">
          <Field label="Priority" value={batch.priority} />
          <Field label="Started" value={formatDateTime(batch.startedAt)} />
          <Field label="Est. Complete" value={formatDateTime(batch.estimatedCompleteAt)} />
          <Field label="ETA" value={batch.etaMinutes > 0 ? `${batch.etaMinutes} min` : "Due"} />
        </dl>

        <div className="mt-5 border-t border-rule pt-4">
          <AdvanceButton batchId={batch.id} stage={batch.stage} />
        </div>
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
