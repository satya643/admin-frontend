"use client";

import { X } from "lucide-react";
import type { ReactNode } from "react";
import { createPortal } from "react-dom";
import { useMounted } from "@/lib/hooks/useMounted";

export function Drawer({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}) {
  const mounted = useMounted();
  if (!open || !mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-brand-navy/40" onClick={onClose} />
      <div className="shadow-popover-surface relative flex h-full w-full max-w-md flex-col border-l border-rule bg-paper-raised">
        <div className="flex items-center justify-between border-b border-rule px-5 py-4">
          <h2 className="font-display text-lg text-ink">{title}</h2>
          <button onClick={onClose} className="text-ink-muted hover:text-ink" aria-label="Close">
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-5 py-4">{children}</div>
      </div>
    </div>,
    document.body,
  );
}
