import type { LucideIcon } from "lucide-react";
import { Inbox } from "lucide-react";
import type { ReactNode } from "react";

export function EmptyState({
  title,
  description,
  icon: Icon = Inbox,
  action,
}: {
  title: string;
  description?: string;
  icon?: LucideIcon;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-[var(--radius-ticket)] border border-dashed border-rule-strong bg-paper-raised px-6 py-14 text-center">
      <Icon className="h-8 w-8 text-ink-muted" strokeWidth={1.5} />
      <p className="mt-3 font-display text-lg text-ink">{title}</p>
      {description ? <p className="mt-1 max-w-sm text-sm text-ink-muted">{description}</p> : null}
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  );
}
