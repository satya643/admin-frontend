"use client";

import { SearchInput } from "@/components/ui/SearchInput";
import { FilterBar, FilterSelect } from "@/components/ui/FilterBar";
import { useDebouncedUrlParam, useUrlParam } from "@/lib/hooks/useUrlParam";
import { ORDER_STATUS_META } from "@/lib/meta/order-status";
import type { OrderStatus } from "@/types/order";

const STATUSES: OrderStatus[] = [
  "pending_payment",
  "confirmed",
  "packed",
  "shipped",
  "with_customer",
  "return_in_transit",
  "closed",
  "cancelled",
];

export function OrderFilters() {
  const [q, setQ] = useDebouncedUrlParam("q");
  const [status, setStatus] = useUrlParam("status", "all");

  return (
    <FilterBar>
      <div className="w-full sm:w-64">
        <SearchInput value={q} onChange={setQ} placeholder="Search order ID or customer…" />
      </div>
      <FilterSelect
        label="Status"
        value={status}
        onChange={setStatus}
        options={[
          { value: "all", label: "All statuses" },
          ...STATUSES.map((s) => ({ value: s, label: ORDER_STATUS_META[s].label })),
        ]}
      />
    </FilterBar>
  );
}
