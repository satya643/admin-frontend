"use client";

import { useTransition } from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { toast } from "sonner";
import { advanceLaundryBatch } from "@/lib/actions/laundry";
import { LAUNDRY_STAGE_META, nextLaundryStage } from "@/lib/meta/laundry-stage";
import type { LaundryStage } from "@/types/laundry";

export function AdvanceButton({ batchId, stage }: { batchId: string; stage: LaundryStage }) {
  const [isPending, startTransition] = useTransition();
  const next = nextLaundryStage(stage);

  function onClick() {
    startTransition(async () => {
      const result = await advanceLaundryBatch(batchId);
      if (result.ok) toast.success(`Advanced to ${next ? LAUNDRY_STAGE_META[next].label : "ready"}.`);
      else toast.error(result.message);
    });
  }

  if (!next) return <span className="text-xs text-ink-muted">Complete</span>;

  return (
    <Button variant="secondary" size="sm" isLoading={isPending} onClick={onClick}>
      {LAUNDRY_STAGE_META[next].label} <ArrowRight className="h-3 w-3" />
    </Button>
  );
}
