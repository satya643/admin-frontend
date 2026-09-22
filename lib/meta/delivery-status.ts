import type { DeliveryStatus } from "@/types/delivery";
import type { StatusTone } from "@/components/ui/StatusBadge";

export const DELIVERY_STATUS_META: Record<DeliveryStatus, { label: string; tone: StatusTone }> = {
  scheduled: { label: "Scheduled", tone: "neutral" },
  en_route: { label: "En Route", tone: "info" },
  completed: { label: "Completed", tone: "success" },
  delayed: { label: "Delayed", tone: "danger" },
};
