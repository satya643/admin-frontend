import type { ButtonHTMLAttributes } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils/cn";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md";

const VARIANT_CLASSES: Record<Variant, string> = {
  primary: "bg-brand-navy text-brand-cream shadow-sm hover:bg-brand-navy-dark hover:shadow-md",
  secondary: "border border-rule-strong bg-paper-raised text-ink hover:border-brand-gold/50 hover:bg-ink/[0.03]",
  ghost: "text-ink hover:bg-ink/[0.06]",
  danger: "bg-signal-danger text-white shadow-sm hover:bg-signal-danger/90 hover:shadow-md",
};

const SIZE_CLASSES: Record<Size, string> = {
  sm: "px-3 py-1.5 text-xs",
  md: "px-4 py-2 text-sm",
};

export function Button({
  variant = "primary",
  size = "md",
  isLoading,
  className,
  children,
  disabled,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant; size?: Size; isLoading?: boolean }) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-1.5 rounded-[var(--radius-chip)] font-medium transition-all active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 disabled:active:scale-100",
        VARIANT_CLASSES[variant],
        SIZE_CLASSES[size],
        className,
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null}
      {children}
    </button>
  );
}
