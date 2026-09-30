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
  payment_failed: { label: "Payment Failed", tone: "danger", step: 0 },
  refunded: { label: "Refunded", tone: "neutral", step: 0 },
};

// Mirrors Loopwear-backend/src/modules/console/orders/service.ts ORDER_TRANSITIONS exactly
// (the order detail response also carries `allowedNextStatuses`, preferred when present).
// Only a verified payment confirms an order — there's no manual pending → confirmed.
// Cancelling a paid order refunds it in full.
export const ALLOWED_ORDER_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  pending_payment: ["cancelled"],
  confirmed: ["packed", "cancelled"],
  packed: ["shipped"],
  shipped: ["with_customer"],
  with_customer: ["return_in_transit", "closed"],
  return_in_transit: ["closed"],
  closed: [],
  cancelled: [],
  payment_failed: [],
  refunded: [],
};
