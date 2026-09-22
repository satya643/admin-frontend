"use client";

import Link from "next/link";
import { useTransition } from "react";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { markNotificationRead } from "@/lib/actions/notifications";
import { NOTIFICATION_SEVERITY_META } from "@/lib/meta/notification-severity";
import { formatRelative } from "@/lib/utils/format";
import type { AdminNotification } from "@/types/notification";

const RELATED_HREF: Record<AdminNotification["relatedType"], (id: string) => string> = {
  order: (id) => `/orders/${id}`,
  batch: (id) => `/laundry/${id}`,
  delivery: () => "/delivery",
  unit: (id) => `/inventory/${id}`,
};

export function NotificationItem({ notification }: { notification: AdminNotification }) {
  const [isPending, startTransition] = useTransition();
  const meta = NOTIFICATION_SEVERITY_META[notification.severity];

  return (
    <li className={`flex items-start justify-between gap-4 px-4 py-3 ${notification.read ? "" : "bg-brand-gold/[0.04]"}`}>
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <StatusBadge label={meta.label} tone={meta.tone} />
          <p className="text-sm font-medium text-ink">{notification.title}</p>
        </div>
        <p className="mt-1 text-sm text-ink-muted">{notification.detail}</p>
        <div className="mt-1.5 flex items-center gap-2 text-xs text-ink-muted">
          <span>{formatRelative(notification.createdAt)}</span>
          <span>·</span>
          <Link href={RELATED_HREF[notification.relatedType](notification.relatedId)} className="hover:underline">
            View {notification.relatedType}
          </Link>
        </div>
      </div>
      {!notification.read ? (
        <button
          disabled={isPending}
          onClick={() => startTransition(() => markNotificationRead(notification.id))}
          className="shrink-0 text-xs font-medium text-brand-gold-deep hover:underline disabled:opacity-50"
        >
          Mark read
        </button>
      ) : null}
    </li>
  );
}
