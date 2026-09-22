import type { AdminNotification } from "@/types/notification";
import { apiFetch } from "@/lib/api/client";
import { getToken } from "@/lib/auth/session";

// Mirrors GET /console/notifications (always latest 50, no pagination).
export async function listNotifications(): Promise<{ items: AdminNotification[]; unreadCount: number }> {
  const token = await getToken();
  return apiFetch<{ items: AdminNotification[]; unreadCount: number }>("/console/notifications", { token: token ?? undefined });
}

export async function getUnreadCount(): Promise<number> {
  const { unreadCount } = await listNotifications();
  return unreadCount;
}
