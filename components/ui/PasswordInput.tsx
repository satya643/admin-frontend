"use client";

import { useState } from "react";
import { Eye, EyeOff, Lock } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export function   PasswordInput({
  value,
  onChange,
  placeholder = "••••••••",
  autoComplete,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  autoComplete?: string;
}) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative">
      <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" />
      <input
        type={visible ? "text" : "password"}
        required
        value={value}
        onChange={(e) => onChange(e.target.value)}
        autoComplete={autoComplete}
        className={cn(
          "w-full rounded-(--radius-chip) border border-rule-strong bg-paper-raised py-2.5 pl-9 pr-10 text-ink",
          visible ? "text-sm" : "text-2xl font-bold tracking-[0.2em]",
        )}
        placeholder={placeholder}
      />
      <button
        type="button"
        onClick={() => setVisible((current) => !current)}
        tabIndex={-1}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-muted hover:text-ink"
        aria-label={visible ? "Hide password" : "Show password"}
      >
        {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
      </button>
    </div>
  );
}
