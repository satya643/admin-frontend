"use client";

import { Search } from "lucide-react";

export function SearchInput({
  value,
  onChange,
  placeholder = "Search…",
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <div className="relative">
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" />
      <input
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="w-full rounded-[var(--radius-chip)] border border-rule-strong bg-paper-raised py-2 pl-9 pr-3 text-sm text-ink placeholder:text-ink-muted"
      />
    </div>
  );
}
