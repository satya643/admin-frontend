export type PaymentMethod = "card" | "wallet" | "bank_transfer" | "upi" | "netbanking" | "other";
export type PaymentStatus = "pending" | "paid" | "partially_refunded" | "refunded" | "failed";
export type PaymentGateway = "stripe" | "razorpay" | "mock";
export type RefundStatus = "pending" | "processed" | "failed";

export interface Payment {
  id: string;
  orderId: string;
  customerId: string;
  amountPaise: number;
  chargedAmountMinor: number;
  chargedCurrency: string;
  method: PaymentMethod;
  status: PaymentStatus;
  gateway: PaymentGateway;
  gatewayRef: string | null;
  gatewayPaymentRef: string | null;
  idempotencyKey: string | null;
  createdAt: string;
  customer: { id: string; name: string };
  order: { id: string };
}

// Per-item (rental deposit: orderItemId) or whole-order (cancellation/late payment: orderId).
export interface Refund {
  id: string;
  orderItemId: string | null;
  orderId?: string | null;
  paymentId: string | null;
  amountPaise: number;
  reason: string;
  status: RefundStatus;
  gatewayRef: string | null;
  actorUserId: string | null;
  createdAt: string;
  processedAt: string | null;
}
