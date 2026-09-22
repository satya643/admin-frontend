"use client";

import { SearchInput } from "@/components/ui/SearchInput";
import { FilterBar, FilterSelect } from "@/components/ui/FilterBar";
import { useDebouncedUrlParam, useUrlParam } from "@/lib/hooks/useUrlParam";
import { GARMENT_STAGES, STAGE_META } from "@/lib/meta/stage";

export function InventoryFilters() {
  const [q, setQ] = useDebouncedUrlParam("q");
  const [stage, setStage] = useUrlParam("stage", "all");

  return (
    <FilterBar>
      <div className="w-full sm:w-64">
        <SearchInput value={q} onChange={setQ} placeholder="Search SKU or product…" />
      </div>
      <FilterSelect
        label="Stage"
        value={stage}
        onChange={setStage}
        options={[
          { value: "all", label: "All stages" },
          ...GARMENT_STAGES.map((s) => ({ value: s, label: STAGE_META[s].label })),
        ]}
      />
    </FilterBar>
  );
}
