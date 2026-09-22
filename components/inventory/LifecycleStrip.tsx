import Link from "next/link";
import { GARMENT_STAGES, STAGE_META } from "@/lib/meta/stage";
import type { LifecycleCounts } from "@/types/garment-unit";

export function LifecycleStrip({ counts, activeStage }: { counts: LifecycleCounts; activeStage?: string }) {
  return (
    <div className="flex flex-wrap gap-2">
      {GARMENT_STAGES.map((stage) => (
        <Link
          key={stage}
          href={`/inventory?stage=${stage}`}
          className={`rounded-[var(--radius-chip)] border px-3 py-2 text-center transition-colors ${
            activeStage === stage ? "border-brand-gold bg-brand-gold/10" : "border-rule bg-paper-raised hover:border-rule-strong"
          }`}
        >
          <p className="font-mono text-lg font-semibold tabular-nums text-ink">{counts[stage]}</p>
          <p className="text-[11px] uppercase tracking-wide text-ink-muted">{STAGE_META[stage].label}</p>
        </Link>
      ))}
    </div>
  );
}
