"use client";

import { useState, useTransition } from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { toast } from "sonner";
import { transitionGarmentUnit } from "@/lib/actions/inventory";
import { STAGE_META } from "@/lib/meta/stage";
import type { GarmentStage } from "@/types/garment-unit";

// Only offers the transitions Loopwear-backend's state machine actually
// allows from the unit's current stage — never an arbitrary stage picker.
export function TransitionPanel({ unitId, currentStage, allowedNext }: { unitId: string; currentStage: GarmentStage; allowedNext: GarmentStage[] }) {
  const [isPending, startTransition] = useTransition();
  const [note, setNote] = useState("");

  function onTransition(toStage: GarmentStage) {
    startTransition(async () => {
      const result = await transitionGarmentUnit({ unitId, toStage, note: note || undefined });
      if (result.ok) {
        toast.success(`Moved to ${STAGE_META[toStage].label}.`);
        setNote("");
      } else {
        toast.error(result.message);
      }
    });
  }

  return (
    <div className="rounded-[var(--radius-ticket)] border border-rule bg-paper-raised p-4">
      <h2 className="mb-3 font-display text-base text-ink">Move Stage</h2>
      <div className="mb-3 flex items-center gap-2 text-sm">
        <StatusBadge label={STAGE_META[currentStage].label} tone={STAGE_META[currentStage].tone} />
      </div>

      {allowedNext.length === 0 ? (
        <p className="text-sm text-ink-muted">This is a terminal stage — no further transitions are allowed.</p>
      ) : (
        <>
          <input
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Optional note"
            className="mb-3 w-full rounded-[var(--radius-chip)] border border-rule-strong bg-paper-raised px-3 py-2 text-sm text-ink"
          />
          <div className="flex flex-wrap gap-2">
            {allowedNext.map((stage) => (
              <Button key={stage} variant="secondary" size="sm" isLoading={isPending} onClick={() => onTransition(stage)}>
                {STAGE_META[stage].label} <ArrowRight className="h-3 w-3" />
              </Button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
