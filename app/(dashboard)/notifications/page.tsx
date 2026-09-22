import { PageHeader } from "@/components/ui/PageHeader";
import { EmptyState } from "@/components/ui/EmptyState";
import { NotificationItem } from "@/components/notifications/NotificationItem";
import { listNotifications } from "@/lib/data/notifications";

export default async function NotificationsPage() {
  const { items, unreadCount } = await listNotifications();

  return (
    <>
      <PageHeader title="Notifications" description={`${unreadCount} unread of the latest ${items.length}`} />

      {items.length === 0 ? (
        <EmptyState title="No notifications" />
      ) : (
        <ul className="divide-y divide-rule rounded-[var(--radius-ticket)] border border-rule bg-paper-raised">
          {items.map((notification) => (
            <NotificationItem key={notification.id} notification={notification} />
          ))}
        </ul>
      )}
    </>
  );
}
