"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { Button } from "./Button";

/**
 * Which page numbers to show around the current page, plus first/last with
 * an ellipsis for the gap — e.g. for page 5 of 20: 1 … 4 5 6 … 20. Keeps the
 * control from growing unbounded on a list with many pages.
 */
function pageItems(page: number, totalPages: number): (number | "ellipsis")[] {
  const items: (number | "ellipsis")[] = [];
  const windowStart = Math.max(2, page - 1);
  const windowEnd = Math.min(totalPages - 1, page + 1);

  items.push(1);
  if (windowStart > 2) items.push("ellipsis");
  for (let p = windowStart; p <= windowEnd; p++) items.push(p);
  if (windowEnd < totalPages - 1) items.push("ellipsis");
  if (totalPages > 1) items.push(totalPages);

  return items;
}

export function Pagination({
  page,
  totalPages,
  total,
  pageSize,
  onPageChange,
}: {
  page: number;
  totalPages: number;
  total: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}) {
  if (totalPages <= 1) return null;

  const start = (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, total);

  return (
    <div className="flex flex-col items-center justify-between gap-3 pt-3 text-sm text-ink-muted sm:flex-row">
      <span>
        Showing <span className="font-medium text-ink">{start}</span>&ndash;
        <span className="font-medium text-ink">{end}</span> of <span className="font-medium text-ink">{total}</span>
      </span>
      <div className="flex items-center gap-1">
        <Button variant="secondary" size="sm" disabled={page <= 1} onClick={() => onPageChange(page - 1)} aria-label="Previous page">
          <ChevronLeft className="h-3.5 w-3.5" />
        </Button>

        <div className="flex items-center gap-1">
          {pageItems(page, totalPages).map((item, index) =>
            item === "ellipsis" ? (
              <span key={`ellipsis-${index}`} className="px-1.5 font-mono text-xs text-ink-muted">
                &hellip;
              </span>
            ) : (
              <button
                key={item}
                type="button"
                onClick={() => onPageChange(item)}
                aria-current={item === page ? "page" : undefined}
                className={cn(
                  "h-8 min-w-8 rounded-[var(--radius-chip)] px-2 font-mono text-xs font-medium transition-colors",
                  item === page
                    ? "bg-brand-navy text-brand-cream shadow-sm"
                    : "text-ink-muted hover:bg-ink/[0.06] hover:text-ink",
                )}
              >
                {item}
              </button>
            ),
          )}
        </div>

        <Button variant="secondary" size="sm" disabled={page >= totalPages} onClick={() => onPageChange(page + 1)} aria-label="Next page">
          <ChevronRight className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
}
