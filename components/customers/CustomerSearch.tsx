"use client";

import { SearchInput } from "@/components/ui/SearchInput";
import { useDebouncedUrlParam } from "@/lib/hooks/useUrlParam";

export function CustomerSearch() {
  const [q, setQ] = useDebouncedUrlParam("q");
  return (
    <div className="w-full sm:w-64">
      <SearchInput value={q} onChange={setQ} placeholder="Search name or email…" />
    </div>
  );
}
