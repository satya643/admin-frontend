import { cn } from "@/lib/utils/cn";

export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn("rounded-[var(--radius-chip)] bg-ink/10", className)}
      style={{ animation: "skeleton-pulse 1.6s ease-in-out infinite" }}
    />
  );
}

export function TableSkeleton({ columns = 4, rows = 6 }: { columns?: number; rows?: number }) {
  return (
    <div className="overflow-hidden rounded-[var(--radius-ticket)] border border-rule bg-paper-raised">
      <div className="border-b border-rule bg-ink/[0.02] px-4 py-3">
        <Skeleton className="h-3 w-32" />
      </div>
      <div className="divide-y divide-rule">
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div key={rowIndex} className="flex items-center gap-6 px-4 py-4">
            {Array.from({ length: columns }).map((__, colIndex) => (
              <Skeleton key={colIndex} className="h-3 flex-1" />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div className="rounded-[var(--radius-ticket)] border border-rule bg-paper-raised p-4">
      <Skeleton className="h-3 w-20" />
      <Skeleton className="mt-3 h-7 w-24" />
    </div>
  );
}
