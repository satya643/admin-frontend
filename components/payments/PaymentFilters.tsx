"use client";

import { FilterBar, FilterSelect } from "@/components/ui/FilterBar";
import { useUrlParam } from "@/lib/hooks/useUrlParam";
import { PAYMENT_STATUS_META } from "@/lib/meta/payment-status";
import type { PaymentMethod, PaymentStatus } from "@/types/payment";

const STATUSES: PaymentStatus[] = ["pending", "paid", "partially_refunded", "refunded", "failed"];
const METHODS: PaymentMethod[] = ["card", "upi", "netbanking", "wallet", "bank_transfer", "other"];

export function PaymentFilters() {
  const [status, setStatus] = useUrlParam("status", "all");
  const [method, setMethod] = useUrlParam("method", "all");

  return (
    <FilterBar>
      <FilterSelect
        label="Status"
        value={status}
        onChange={setStatus}
        options={[{ value: "all", label: "All statuses" }, ...STATUSES.map((s) => ({ value: s, label: PAYMENT_STATUS_META[s].label }))]}
      />
      <FilterSelect
        label="Method"
        value={method}
        onChange={setMethod}
        options={[{ value: "all", label: "All methods" }, ...METHODS.map((m) => ({ value: m, label: m.replace("_", " ") }))]}
      />
    </FilterBar>
  );
}
