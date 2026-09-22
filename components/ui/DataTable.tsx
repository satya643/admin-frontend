import type { ReactNode } from "react";
import { EmptyState } from "./EmptyState";
import { TableSkeleton } from "./LoadingSkeleton";

export interface Column<T> {
  key: string;
  header: string;
  render: (row: T) => ReactNode;
  className?: string;
}

export function DataTable<T>({
  columns,
  rows,
  rowKey,
  isLoading,
  emptyTitle = "Nothing here yet",
  emptyDescription,
  onRowClick,
}: {
  columns: Column<T>[];
  rows: T[];
  rowKey: (row: T) => string;
  isLoading?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
  onRowClick?: (row: T) => void;
}) {
  if (isLoading) return <TableSkeleton columns={columns.length} />;

  if (rows.length === 0) {
    return <EmptyState title={emptyTitle} description={emptyDescription} />;
  }

  return (
    <div className="overflow-x-auto rounded-[var(--radius-ticket)] border border-rule bg-paper-raised">
      <table className="w-full min-w-[640px] border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-rule bg-ink/[0.02]">
            {columns.map((column) => (
              <th
                key={column.key}
                className="px-4 py-3 text-xs font-medium uppercase tracking-wide text-ink-muted"
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr
              key={rowKey(row)}
              onClick={onRowClick ? () => onRowClick(row) : undefined}
              className={
                onRowClick
                  ? "cursor-pointer border-b border-rule last:border-0 hover:bg-brand-gold/[0.06]"
                  : "border-b border-rule last:border-0"
              }
            >
              {columns.map((column) => (
                <td key={column.key} className={`px-4 py-3 align-middle ${column.className ?? ""}`}>
                  {column.render(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
