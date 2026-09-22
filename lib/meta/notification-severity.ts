import type { NotificationSeverity } from "@/types/notification";
import type { StatusTone } from "@/components/ui/StatusBadge";

export const NOTIFICATION_SEVERITY_META: Record<NotificationSeverity, { label: string; tone: StatusTone }> = {
  info: { label: "Info", tone: "info" },
  success: { label: "Success", tone: "success" },
  warning: { label: "Warning", tone: "warning" },
  danger: { label: "Danger", tone: "danger" },
};
