import { PageHeader } from "@/components/ui/PageHeader";
import { requireAdmin } from "@/lib/auth/session";
import { initials } from "@/lib/utils/format";

export default async function SettingsPage() {
  const user = await requireAdmin();

  return (
    <>
      <PageHeader title="Settings" description="Your account and console configuration" />

      <div className="rounded-[var(--radius-ticket)] border border-rule bg-paper-raised p-4">
        <h2 className="mb-3 font-display text-base text-ink">Account</h2>
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-navy font-mono text-sm font-medium text-brand-cream">
            {initials(user.name)}
          </div>
          <div>
            <p className="text-sm font-medium text-ink">{user.name}</p>
            <p className="text-sm text-ink-muted">{user.email}</p>
            <p className="text-xs capitalize text-ink-muted">Role: {user.role}</p>
          </div>
        </div>
      </div>

      <div className="rounded-[var(--radius-ticket)] border border-rule bg-paper-raised p-4">
        <h2 className="mb-3 font-display text-base text-ink">Console</h2>
        <dl className="grid grid-cols-2 gap-4 text-sm sm:grid-cols-3">
          <div>
            <dt className="text-xs uppercase tracking-wide text-ink-muted">Environment</dt>
            <dd className="mt-0.5 text-ink">{process.env.NODE_ENV}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wide text-ink-muted">Data Source</dt>
            <dd className="mt-0.5 text-ink">Live backend</dd>
          </div>
        </dl>
      </div>
    </>
  );
}
