export type LaundryStage = "received" | "washing" | "drying" | "pressing" | "quality" | "ready";
export type LaundryPriority = "standard" | "rush";

export interface LaundryBatch {
  id: string;
  facilityId: string;
  stage: LaundryStage;
  priority: LaundryPriority;
  startedAt: string;
  estimatedCompleteAt: string;
  etaMinutes: number;
  garmentCount: number;
}

export interface Facility {
  id: string;
  name: string;
  city: string;
}
