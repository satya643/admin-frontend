"use client";

import { FilterBar, FilterSelect } from "@/components/ui/FilterBar";
import { useUrlParam } from "@/lib/hooks/useUrlParam";
import { DELIVERY_STATUS_META } from "@/lib/meta/delivery-status";
import type { DeliveryStatus } from "@/types/delivery";

const STATUSES: DeliveryStatus[] = ["scheduled", "en_route", "completed", "delayed"];

export function DeliveryFilters() {
  const [status, setStatus] = useUrlParam("status", "all");
  const [type, setType] = useUrlParam("type", "all");

  return (
    <FilterBar>
      <FilterSelect
        label="Status"
        value={status}
        onChange={setStatus}
        options={[{ value: "all", label: "All statuses" }, ...STATUSES.map((s) => ({ value: s, label: DELIVERY_STATUS_META[s].label }))]}
      />
      <FilterSelect
        label="Type"
        value={type}
        onChange={setType}
        options={[
          { value: "all", label: "Pickup & Dropoff" },
          { value: "pickup", label: "Pickup" },
          { value: "dropoff", label: "Dropoff" },
        ]}
      />
    </FilterBar>
  );
}
