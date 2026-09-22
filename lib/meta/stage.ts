import type { GarmentStage } from "@/types/garment-unit";
import type { StatusTone } from "@/components/ui/StatusBadge";

export const STAGE_META: Record<GarmentStage, { label: string; tone: StatusTone }> = {
  available: { label: "Available", tone: "success" },
  reserved: { label: "Reserved", tone: "warning" },
  rented: { label: "Rented", tone: "info" },
  returned: { label: "Returned", tone: "neutral" },
  inspection: { label: "Inspection", tone: "warning" },
  laundry: { label: "Laundry", tone: "info" },
  quality: { label: "Quality Check", tone: "neutral" },
  ready: { label: "Ready", tone: "success" },
  retired: { label: "Retired", tone: "neutral" },
  sold: { label: "Sold", tone: "neutral" },
};

export const GARMENT_STAGES: GarmentStage[] = [
  "available",
  "reserved",
  "rented",
  "returned",
  "inspection",
  "laundry",
  "quality",
  "ready",
  "retired",
  "sold",
];
