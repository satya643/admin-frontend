"use client";

import { X } from "lucide-react";
import type { ReactNode } from "react";
import { useEffect } from "react";
import { createPortal } from "react-dom";
import { useMounted } from "@/lib/hooks/useMounted";

export function Modal({
  open,
  onClose,
  title,
  children,
  footer,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  const mounted = useMounted();

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!open || !mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-brand-navy/40" onClick={onClose} />
      <div className="shadow-popover-surface relative w-full max-w-md rounded-[var(--radius-ticket)] border border-rule bg-paper-raised">
        <div className="flex items-center justify-between border-b border-rule px-5 py-4">
          <h2 className="font-display text-lg text-ink">{title}</h2>
          <button onClick={onClose} className="text-ink-muted hover:text-ink" aria-label="Close">
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="px-5 py-4">{children}</div>
        {footer ? <div className="flex justify-end gap-2 border-t border-rule px-5 py-4">{footer}</div> : null}
      </div>
    </div>,
    document.body,
  );
}
