import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import type { StatusTone } from "./StatusBadge";

const TONE_TEXT: Record<StatusTone, string> = {
  neutral: "text-ink",
  success: "text-signal-success",
  warning: "text-signal-warning",
  danger: "text-signal-danger",
  info: "text-signal-info",
};

const TONE_ICON_BADGE: Record<StatusTone, string> = {
  neutral: "bg-ink/[0.06] text-ink-muted",
  success: "bg-signal-success/10 text-signal-success",
  warning: "bg-signal-warning/10 text-signal-warning",
  danger: "bg-signal-danger/10 text-signal-danger",
  info: "bg-signal-info/10 text-signal-info",
};

export function MetricCard({
  label,
  value,
  icon: Icon,
  tone = "neutral",
  hint,
}: {
  label: string;
  value: string;
  icon?: LucideIcon;
  tone?: StatusTone;
  hint?: string;
}) {
  return (
    <div className="rounded-[var(--radius-ticket)] border border-rule bg-paper-raised p-4">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium uppercase tracking-wide text-ink-muted">{label}</span>
        {Icon ? (
          <span className={cn("flex h-8 w-8 items-center justify-center rounded-full", TONE_ICON_BADGE[tone])}>
            <Icon className="h-4 w-4" strokeWidth={1.75} />
          </span>
        ) : null}
      </div>
      <p className={cn("mt-2 font-mono text-2xl font-semibold tabular-nums", TONE_TEXT[tone])}>{value}</p>
      {hint ? <p className="mt-1 text-xs text-ink-muted">{hint}</p> : null}
    </div>
  );
}
