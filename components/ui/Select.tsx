"use client";

import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

/**
 * A styled drop-in replacement for native <select>. The native element's
 * closed box can be restyled with CSS, but its OPEN options list is drawn
 * by the OS, not the page — no amount of CSS reaches it, which is why every
 * dropdown in the app still showed the browser's default blue-highlight
 * list despite the rest of the panel's design. This renders both the
 * trigger and the list ourselves, so both are on-brand.
 */
export function Select({
  value,
  onChange,
  options,
  placeholder = "Select…",
  disabled,
  className,
  size = "md",
}: {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  size?: "sm" | "md";
}) {
  const [open, setOpen] = useState(false);
  const [highlighted, setHighlighted] = useState(-1);
  const rootRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const selectedIndex = options.findIndex((o) => o.value === value);
  const selected = options[selectedIndex];

  useEffect(() => {
    if (!open) return;
    setHighlighted(selectedIndex >= 0 ? selectedIndex : 0);

    function onPointerDown(event: PointerEvent) {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only re-run when opening
  }, [open]);

  useEffect(() => {
    if (open && highlighted >= 0) {
      listRef.current?.children[highlighted]?.scrollIntoView({ block: "nearest" });
    }
  }, [open, highlighted]);

  function commit(index: number) {
    const option = options[index];
    if (!option || option.disabled) return;
    onChange(option.value);
    setOpen(false);
  }

  function onKeyDown(event: React.KeyboardEvent) {
    if (disabled) return;
    if (!open) {
      if (event.key === "Enter" || event.key === " " || event.key === "ArrowDown" || event.key === "ArrowUp") {
        event.preventDefault();
        setOpen(true);
      }
      return;
    }
    if (event.key === "Escape") {
      event.preventDefault();
      setOpen(false);
    } else if (event.key === "ArrowDown") {
      event.preventDefault();
      setHighlighted((i) => Math.min(options.length - 1, (i < 0 ? -1 : i) + 1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setHighlighted((i) => Math.max(0, (i < 0 ? options.length : i) - 1));
    } else if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      commit(highlighted);
    }
  }

  const sizeClasses = size === "sm" ? "px-2.5 py-1.5 text-xs" : "px-3 py-2 text-sm";

  return (
    <div ref={rootRef} className={cn("relative", className)}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen((o) => !o)}
        onKeyDown={onKeyDown}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={cn(
          "flex w-full items-center justify-between gap-2 rounded-[var(--radius-chip)] border bg-paper-raised text-left text-ink transition-colors",
          sizeClasses,
          open ? "border-brand-gold shadow-[0_0_0_2px_var(--color-brand-gold)]" : "border-rule-strong hover:border-brand-gold/60",
          disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer",
        )}
      >
        <span className={cn("truncate", !selected ? "text-ink-muted" : "")}>{selected ? selected.label : placeholder}</span>
        <ChevronDown className={cn("h-4 w-4 shrink-0 text-ink-muted transition-transform duration-150", open ? "rotate-180" : "")} />
      </button>

      {open ? (
        <ul
          ref={listRef}
          role="listbox"
          tabIndex={-1}
          className="shadow-popover-surface bg-paper-raised absolute z-40 mt-1.5 max-h-64 w-full min-w-max overflow-auto rounded-[var(--radius-chip)] border border-rule p-1"
        >
          {options.map((option, index) => (
            <li
              key={option.value}
              role="option"
              aria-selected={option.value === value}
              onMouseEnter={() => setHighlighted(index)}
              onClick={() => commit(index)}
              className={cn(
                "flex cursor-pointer items-center justify-between gap-3 rounded-[var(--radius-chip)] px-3 py-2 text-sm transition-colors",
                option.disabled
                  ? "cursor-not-allowed text-ink-muted/50"
                  : index === highlighted
                    ? "bg-brand-gold/12 text-ink"
                    : option.value === value
                      ? "font-medium text-brand-gold-deep"
                      : "text-ink hover:bg-ink/[0.05]",
              )}
            >
              {option.label}
              {option.value === value ? <Check className="h-3.5 w-3.5 shrink-0 text-brand-gold-deep" /> : null}
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
