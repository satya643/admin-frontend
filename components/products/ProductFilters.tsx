"use client";

import { SearchInput } from "@/components/ui/SearchInput";
import { FilterBar, FilterSelect } from "@/components/ui/FilterBar";
import { useDebouncedUrlParam, useUrlParam } from "@/lib/hooks/useUrlParam";
import type { Category } from "@/types/category";

export function ProductFilters({ categories }: { categories: Category[] }) {
  const [q, setQ] = useDebouncedUrlParam("q");
  const [categoryId, setCategoryId] = useUrlParam("categoryId", "all");

  return (
    <FilterBar>
      <div className="w-full sm:w-64">
        <SearchInput value={q} onChange={setQ} placeholder="Search name or brand…" />
      </div>
      <FilterSelect
        label="Category"
        value={categoryId}
        onChange={setCategoryId}
        options={[{ value: "all", label: "All categories" }, ...categories.map((c) => ({ value: c.id, label: c.name }))]}
      />
    </FilterBar>
  );
}
