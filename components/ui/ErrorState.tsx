import { AlertOctagon } from "lucide-react";
import { Button } from "./Button";

export function ErrorState({
  message = "Something went wrong loading this page.",
  onRetry,
}: {
  message?: string;
  onRetry?: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-[var(--radius-ticket)] border border-signal-danger/20 bg-signal-danger/5 px-6 py-14 text-center">
      <AlertOctagon className="h-8 w-8 text-signal-danger" strokeWidth={1.5} />
      <p className="mt-3 font-display text-lg text-ink">Couldn&apos;t load this</p>
      <p className="mt-1 max-w-sm text-sm text-ink-muted">{message}</p>
      {onRetry ? (
        <Button variant="secondary" size="sm" className="mt-4" onClick={onRetry}>
          Retry
        </Button>
      ) : null}
    </div>
  );
}

export function UnauthorizedState() {
  return (
    <div className="flex flex-col items-center justify-center rounded-[var(--radius-ticket)] border border-rule-strong bg-paper-raised px-6 py-14 text-center">
      <p className="font-display text-lg text-ink">Sign in required</p>
      <p className="mt-1 max-w-sm text-sm text-ink-muted">Your session has expired. Sign in again to continue.</p>
    </div>
  );
}

export function ForbiddenState() {
  return (
    <div className="flex flex-col items-center justify-center rounded-[var(--radius-ticket)] border border-rule-strong bg-paper-raised px-6 py-14 text-center">
      <p className="font-display text-lg text-ink">Access restricted</p>
      <p className="mt-1 max-w-sm text-sm text-ink-muted">
        Your account doesn&apos;t have permission to view this section.
      </p>
    </div>
  );
}
