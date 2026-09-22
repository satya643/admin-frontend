import { CheckCircle2, AlertTriangle, XCircle, Info, Circle } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export type StatusTone = "neutral" | "success" | "warning" | "danger" | "info";

const TONE_CLASSES: Record<StatusTone, string> = {
  neutral: "bg-ink/[0.06] text-ink-muted",
  success: "bg-signal-success/10 text-signal-success",
  warning: "bg-signal-warning/10 text-signal-warning",
  danger: "bg-signal-danger/10 text-signal-danger",
  info: "bg-signal-info/10 text-signal-info",
};

// A real status icon per tone, not just a color dot — "reserved"/"pending"
// reads instantly as a clock, "failed"/"cancelled" as an X, etc., without
// having to already know what each color means.
const TONE_ICONS: Record<StatusTone, typeof CheckCircle2> = {
  neutral: Circle,
  success: CheckCircle2,
  warning: AlertTriangle,
  danger: XCircle,
  info: Info,
};

export function StatusBadge({ label, tone = "neutral" }: { label: string; tone?: StatusTone }) {
  const Icon = TONE_ICONS[tone];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-[var(--radius-chip)] px-2 py-0.5 text-xs font-medium font-mono uppercase tracking-wide",
        TONE_CLASSES[tone],
      )}
    >
      <Icon className={cn("h-3 w-3 shrink-0", tone === "neutral" ? "fill-current" : "")} strokeWidth={2} />
      {label}
    </span>
  );
}
