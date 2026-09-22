"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Mail } from "lucide-react";
import { toast } from "sonner";
import { PasswordInput } from "@/components/ui/PasswordInput";
import { signIn } from "@/lib/auth/actions";

// Calls the real POST /api/auth/sign-in (the only login endpoint the
// backend has — see the architecture report). The admin session this
// creates is entirely separate from the customer app's: a different
// cookie (eo_admin_token) set by lib/auth/session.ts, and signIn() itself
// refuses to establish a session for any account that isn't operator/admin.
export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@loopwear.dev");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);

    if (!email || !password) {
      setError("Enter both email and password.");
      return;
    }

    setIsSubmitting(true);
    const result = await signIn(email, password);
    setIsSubmitting(false);

    if (!result.ok) {
      setError(result.message ?? "Sign in failed.");
      return;
    }

    toast.success("Signed in.");
    router.push("/dashboard");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <div>
        <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-ink-muted">Email</label>
        <div className="relative">
          <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" />
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-[var(--radius-chip)] border border-rule-strong bg-paper-raised py-2.5 pl-9 pr-3 text-sm text-ink"
            placeholder="you@everyoccasion.com"
          />
        </div>
      </div>

      <div>
        <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-ink-muted">Password</label>
        <PasswordInput value={password} onChange={setPassword} autoComplete="current-password" />
      </div>

      {error ? <p className="text-sm text-signal-danger">{error}</p> : null}

      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-2 flex items-center justify-center gap-2 rounded-(--radius-chip) bg-brand-navy py-2.5 text-sm font-medium text-brand-cream transition-colors hover:bg-brand-navy-dark disabled:opacity-60"
      >
        {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
        Sign in
      </button>

      <p className="text-center text-xs text-ink-muted">
        Only operator and admin accounts can access this console.
      </p>
    </form>
  );
}
