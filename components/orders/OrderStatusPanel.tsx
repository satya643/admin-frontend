"use client";

import { useTransition } from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { toast } from "sonner";
import { updateOrderStatus } from "@/lib/actions/orders";
import { ORDER_STATUS_META } from "@/lib/meta/order-status";
import type { OrderStatus } from "@/types/order";

// Only offers the transitions Loopwear-backend's ORDER_TRANSITIONS table
// actually allows from the order's current status.
export function OrderStatusPanel({ orderId, currentStatus, allowedNext }: { orderId: string; currentStatus: OrderStatus; allowedNext: OrderStatus[] }) {
  const [isPending, startTransition] = useTransition();

  function onUpdate(status: OrderStatus) {
    startTransition(async () => {
      const result = await updateOrderStatus({ orderId, status });
      if (result.ok) toast.success(`Order moved to ${ORDER_STATUS_META[status].label}.`);
      else toast.error(result.message);
    });
  }

  return (
    <div className="rounded-[var(--radius-ticket)] border border-rule bg-paper-raised p-4">
      <h2 className="mb-3 font-display text-base text-ink">Order Status</h2>
      <div className="mb-3">
        <StatusBadge label={ORDER_STATUS_META[currentStatus].label} tone={ORDER_STATUS_META[currentStatus].tone} />
      </div>

      {allowedNext.length === 0 ? (
        <p className="text-sm text-ink-muted">This order is in a terminal status.</p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {allowedNext.map((status) => (
            <Button key={status} variant="secondary" size="sm" isLoading={isPending} onClick={() => onUpdate(status)}>
              {ORDER_STATUS_META[status].label} <ArrowRight className="h-3 w-3" />
            </Button>
          ))}
        </div>
      )}
    </div>
  );
}
