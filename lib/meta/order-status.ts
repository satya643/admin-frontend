import type { OrderStatus } from "@/types/order";
import type { StatusTone } from "@/components/ui/StatusBadge";

export const ORDER_STATUS_META: Record<OrderStatus, { label: string; tone: StatusTone; step: number }> = {
  pending_payment: { label: "Pending Payment", tone: "warning", step: 1 },
  confirmed: { label: "Confirmed", tone: "info", step: 2 },
  packed: { label: "Packed", tone: "info", step: 3 },
  shipped: { label: "Shipped", tone: "info", step: 4 },
  with_customer: { label: "With Customer", tone: "success", step: 5 },
  return_in_transit: { label: "Return In Transit", tone: "warning", step: 6 },
  closed: { label: "Closed", tone: "neutral", step: 7 },
  cancelled: { label: "Cancelled", tone: "danger", step: 0 },
};

// Mirrors Loopwear-backend/src/modules/console/orders/service.ts ORDER_TRANSITIONS exactly.
export const ALLOWED_ORDER_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  pending_payment: ["confirmed", "cancelled"],
  confirmed: ["packed", "cancelled"],
  packed: ["shipped"],
  shipped: ["with_customer"],
  with_customer: ["return_in_transit"],
  return_in_transit: ["closed"],
  closed: [],
  cancelled: [],
};
