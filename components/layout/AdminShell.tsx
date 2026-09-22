"use client";

import { useState } from "react";
import Link from "next/link";
import { Bell, Menu, X } from "lucide-react";
import type { ReactNode } from "react";
import { SidebarNav, Sidebar } from "./Sidebar";
import { LogoutButton } from "./LogoutButton";
import { SearchInput } from "@/components/ui/SearchInput";
import { Logo } from "@/components/branding/Logo";
import { initials } from "@/lib/utils/format";
import type { AdminUser } from "@/types/auth";

export function AdminShell({
  user,
  unreadCount,
  children,
}: {
  user: AdminUser;
  unreadCount: number;
  children: ReactNode;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-paper">
      <Sidebar />

      {mobileOpen ? (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div className="absolute inset-0 bg-brand-navy/50" onClick={() => setMobileOpen(false)} />
          <div className="relative flex w-64 flex-col bg-brand-navy">
            <div className="flex items-center justify-between border-b border-white/10 px-4 py-5">
              <Logo variant="dark" size="md" showTagline />
              <button onClick={() => setMobileOpen(false)} className="text-brand-cream/70" aria-label="Close menu">
                <X className="h-5 w-5" />
              </button>
            </div>
            <SidebarNav onNavigate={() => setMobileOpen(false)} />
          </div>
        </div>
      ) : null}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-rule bg-paper-raised/95 px-4 py-3 backdrop-blur">
          <button
            onClick={() => setMobileOpen(true)}
            className="text-ink-muted hover:text-ink lg:hidden"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>

          <Logo variant="light" size="sm" showWordmark={false} className="lg:hidden" />

          <div className="hidden max-w-xs flex-1 sm:block">
            <SearchInput value="" onChange={() => {}} placeholder="Search orders, customers, SKUs…" />
          </div>

          <div className="ml-auto flex items-center gap-3">
            <Link
              href="/notifications"
              className="relative rounded-[var(--radius-chip)] p-2 text-ink-muted transition-colors hover:bg-ink/[0.06] hover:text-ink"
              aria-label={unreadCount > 0 ? `Notifications, ${unreadCount} unread` : "Notifications"}
            >
              <Bell className="h-4.5 w-4.5" />
              {unreadCount > 0 ? (
                <span className="absolute -right-1 -top-1 flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-signal-danger px-1 font-mono text-[10px] font-semibold leading-none text-white ring-2 ring-paper-raised">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              ) : null}
            </Link>

            <div className="flex items-center gap-2 border-l border-rule pl-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-navy font-mono text-xs font-medium text-brand-cream">
                {initials(user.name)}
              </div>
              <div className="hidden leading-tight sm:block">
                <p className="text-sm font-medium text-ink">{user.name}</p>
                <p className="text-xs capitalize text-ink-muted">{user.role}</p>
              </div>
            </div>

            <LogoutButton />
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <div className="mx-auto flex max-w-7xl flex-col gap-6">{children}</div>
        </main>
      </div>
    </div>
  );
}
