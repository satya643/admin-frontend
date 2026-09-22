import type { ReactNode } from "react";
import { AdminShell } from "@/components/layout/AdminShell";
import { requireAdmin } from "@/lib/auth/session";
import { getUnreadCount } from "@/lib/data/notifications";

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  // requireAdmin() redirects to /login by itself if there's no valid
  // session or the role isn't operator/admin — this is the real
  // authorization check, not just the middleware's cookie-presence guard.
  const [user, unreadCount] = await Promise.all([requireAdmin(), getUnreadCount()]);

  return (
    <AdminShell user={user} unreadCount={unreadCount}>
      {children}
    </AdminShell>
  );
}
