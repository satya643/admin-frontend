"use client";

import type { ReactNode } from "react";
import { Select } from "./Select";

export function FilterBar({ children }: { children: ReactNode }) {
  return <div className="flex flex-wrap items-center gap-2">{children}</div>;
}

export function FilterSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <label className="flex items-center gap-2 text-sm text-ink-muted">
      <span className="hidden sm:inline">{label}</span>
      <Select value={value} onChange={onChange} options={options} size="sm" className="min-w-36" />
    </label>
  );
}
