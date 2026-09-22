import type { LaundryStage } from "@/types/laundry";
import type { StatusTone } from "@/components/ui/StatusBadge";

export const LAUNDRY_STAGE_META: Record<LaundryStage, { label: string; tone: StatusTone }> = {
  received: { label: "Received", tone: "neutral" },
  washing: { label: "Washing", tone: "info" },
  drying: { label: "Drying", tone: "info" },
  pressing: { label: "Pressing", tone: "info" },
  quality: { label: "Quality Check", tone: "warning" },
  ready: { label: "Ready", tone: "success" },
};

export const LAUNDRY_STAGE_ORDER: LaundryStage[] = [
  "received",
  "washing",
  "drying",
  "pressing",
  "quality",
  "ready",
];

// POST /console/laundry/batches/:id/advance takes no body — it always moves
// to the next stage in this fixed sequence (Loopwear-backend laundry service.ts).
export function nextLaundryStage(stage: LaundryStage): LaundryStage | null {
  const index = LAUNDRY_STAGE_ORDER.indexOf(stage);
  return index === -1 || index === LAUNDRY_STAGE_ORDER.length - 1 ? null : LAUNDRY_STAGE_ORDER[index + 1];
}
