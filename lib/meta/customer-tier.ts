import type { CustomerTier } from "@/types/customer";
import type { StatusTone } from "@/components/ui/StatusBadge";

export const CUSTOMER_TIER_META: Record<CustomerTier, { label: string; tone: StatusTone }> = {
  signature: { label: "Signature", tone: "success" },
  member: { label: "Member", tone: "info" },
  new: { label: "New", tone: "neutral" },
};
