"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_ITEMS } from "@/lib/nav";
import { cn } from "@/lib/utils/cn";
import { Logo } from "@/components/branding/Logo";

function isActive(pathname: string, href: string): boolean {
  return href === "/dashboard" ? pathname === href : pathname.startsWith(href);
}

export function SidebarNav({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <nav className="flex flex-1 flex-col gap-0.5 overflow-y-auto px-2 py-4">
      {NAV_ITEMS.map((item) => {
        const active = isActive(pathname, item.href);
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={cn(
              "relative flex items-center gap-3 rounded-[var(--radius-chip)] px-3 py-2 text-sm transition-all",
              active
                ? "bg-white/10 font-medium text-brand-gold-light shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)]"
                : "text-brand-cream/70 hover:translate-x-0.5 hover:bg-white/5 hover:text-brand-cream",
            )}
          >
            {active ? (
              <span className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-full bg-brand-gold" />
            ) : null}
            <Icon className="h-4 w-4 shrink-0" strokeWidth={1.75} />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

export function Sidebar() {
  return (
    <aside className="hidden w-64 shrink-0 flex-col bg-brand-navy lg:flex">
      <div className="flex items-center gap-2 border-b border-white/10 px-5 py-6">
        <Logo variant="dark" size="md" showTagline />
      </div>
      <SidebarNav />
    </aside>
  );
}
