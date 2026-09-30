import type { GarmentUnitListItem } from "./garment-unit";

export type OrderStatus =
  | "pending_payment"
  | "confirmed"
  | "packed"
  | "shipped"
  | "with_customer"
  | "return_in_transit"
  | "closed"
  | "cancelled"
  | "payment_failed"
  | "refunded";

export type CartMode = "rent" | "buy";

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  product: { id: string; name: string };
  // Snapshots taken at purchase time (null on orders placed before they existed).
  productName?: string | null;
  color?: string | null;
  garmentUnitId: string | null;
  garmentUnit: GarmentUnitListItem | null;
  mode: CartMode;
  size: string;
  unitPricePaise: number;
  depositPaise: number;
  rentDays: number | null;
  rentStartDate: string | null;
  rentReturnDate: string | null;
  actualReturnDate: string | null;
}

export interface OrderListItem {
  id: string;
  status: OrderStatus;
  statusLabel: string;
  customer: { id: string; name: string; email: string } | undefined;
  placedAt: string;
  eventDate: string | null;
  city: string | null;
  totalPaise: number;
  depositTotalPaise: number;
  currency: string;
}

export type OrderEventType =
  | "order_created"
  | "payment_initiated"
  | "payment_failed"
  | "payment_cancelled"
  | "payment_succeeded"
  | "status_changed"
  | "order_cancelled"
  | "order_expired"
  | "refund_initiated"
  | "refunded"
  | "note";

export interface OrderEvent {
  id: string;
  type: OrderEventType;
  status: OrderStatus | null;
  message: string;
  actor: "customer" | "system" | "operator" | "gateway";
  actorUserId: string | null;
  createdAt: string;
}

export interface OrderDetail extends OrderListItem {
  items: OrderItem[];
  subtotalPaise: number;
  discountPaise: number;
  deliveryFeePaise: number;
  grandTotalPaise: number;
  couponCode: string | null;
  deliveryMethodLabel: string | null;
  paymentExpiresAt: string | null;
  confirmedAt: string | null;
  cancelledAt: string | null;
  cancelReason: string | null;
  /** The backend's own transition table for this order's status. */
  allowedNextStatuses?: OrderStatus[];
  events: OrderEvent[];
}
