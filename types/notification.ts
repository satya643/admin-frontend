export type NotificationSeverity = "info" | "warning" | "danger" | "success";
export type RelatedType = "order" | "batch" | "delivery" | "unit";

export interface AdminNotification {
  id: string;
  severity: NotificationSeverity;
  title: string;
  detail: string;
  relatedType: RelatedType;
  relatedId: string;
  createdAt: string;
  read: boolean;
}
