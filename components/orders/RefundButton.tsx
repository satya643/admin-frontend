"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/Button";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { toast } from "sonner";
import { refundOrderItem } from "@/lib/actions/payments";
import { formatPaise } from "@/lib/utils/format";

export function RefundButton({ orderItemId, depositPaise, currency }: { orderItemId: string; depositPaise: number; currency: string }) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  function onConfirm() {
    startTransition(async () => {
      const result = await refundOrderItem(orderItemId);
      setOpen(false);
      if (result.ok) toast.success("Refund processed.");
      else toast.error(result.message);
    });
  }

  return (
    <>
      <Button variant="secondary" size="sm" onClick={() => setOpen(true)}>
        Refund Deposit
      </Button>
      <ConfirmDialog
        open={open}
        onClose={() => setOpen(false)}
        onConfirm={onConfirm}
        title="Refund deposit?"
        description={`This refunds the deposit for this item (up to ${formatPaise(depositPaise, currency)}, scaled by garment condition at inspection).`}
        confirmLabel="Refund"
        isLoading={isPending}
      />
    </>
  );
}
