import type { GarmentStage } from "@/types/garment-unit";

// Mirrors Loopwear-backend/src/modules/console/lifecycle/stateMachine.ts
// exactly (TRANSITIONS table) so the UI never offers an illegal move.
// "available -> sold" is driven only by the payment confirmation flow, not
// this manual endpoint, so it is intentionally absent here too.
export const ALLOWED_TRANSITIONS: Record<GarmentStage, GarmentStage[]> = {
  available: ["reserved", "retired"],
  reserved: ["rented", "available"],
  rented: ["returned"],
  returned: ["inspection"],
  inspection: ["laundry", "quality", "retired"],
  laundry: ["quality"],
  quality: ["ready", "retired"],
  ready: ["available"],
  retired: [],
  sold: [],
};
