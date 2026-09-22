export type PaymentMethod = "card" | "wallet" | "bank_transfer";
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

export interface Refund {
  id: string;
  orderItemId: string;
  paymentId: string | null;
  amountPaise: number;
  reason: string;
  status: RefundStatus;
  gatewayRef: string | null;
  actorUserId: string | null;
  createdAt: string;
  processedAt: string | null;
}
