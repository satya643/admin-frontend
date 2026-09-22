import type { PaymentStatus, RefundStatus } from "@/types/payment";
import type { StatusTone } from "@/components/ui/StatusBadge";

export const PAYMENT_STATUS_META: Record<PaymentStatus, { label: string; tone: StatusTone }> = {
  pending: { label: "Pending", tone: "warning" },
  paid: { label: "Paid", tone: "success" },
  partially_refunded: { label: "Partially Refunded", tone: "info" },
  refunded: { label: "Refunded", tone: "neutral" },
  failed: { label: "Failed", tone: "danger" },
};

export const REFUND_STATUS_META: Record<RefundStatus, { label: string; tone: StatusTone }> = {
  pending: { label: "Pending", tone: "warning" },
  processed: { label: "Processed", tone: "success" },
  failed: { label: "Failed", tone: "danger" },
};
