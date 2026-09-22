export type GarmentStage =
  | "available"
  | "reserved"
  | "rented"
  | "returned"
  | "inspection"
  | "laundry"
  | "quality"
  | "ready"
  | "retired"
  | "sold";

export type GarmentCondition = "excellent" | "good" | "fair" | "needs_review";

export interface GarmentUnitListItem {
  id: string;
  sku: string;
  variantId: string;
  product: { id: string; name: string; brand: string };
  // The physical unit's own color, from its ProductVariant — a product can
  // now have multiple colors (see ProductVariant), so this is the specific
  // one this unit actually is, not the product's "default" color.
  color: string;
  size: string;
  stage: GarmentStage;
  condition: GarmentCondition;
  lastMovedAt: string;
  timesRented: number;
  currentOrderId: string | null;
  facilityId: string | null;
}

export interface StageTransition {
  id: string;
  garmentUnitId: string;
  fromStage: GarmentStage | null;
  toStage: GarmentStage;
  actorUserId: string | null;
  occurredAt: string;
  note: string | null;
}

export interface GarmentUnitDetail extends GarmentUnitListItem {
  currentOrder: { id: string; status: string; customer: { name: string } } | null;
  stageTransitions: StageTransition[];
}

export type LifecycleCounts = Record<GarmentStage, number>;
