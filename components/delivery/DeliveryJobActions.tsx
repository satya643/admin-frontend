"use client";

import { useState, useTransition } from "react";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import { toast } from "sonner";
import { assignCourier, completeDeliveryJob } from "@/lib/actions/delivery";
import type { Courier, DeliveryJob } from "@/types/delivery";

export function DeliveryJobActions({ job, couriers }: { job: DeliveryJob; couriers: Courier[] }) {
  const [isPending, startTransition] = useTransition();
  const [courierId, setCourierId] = useState(job.courier?.id ?? "");

  function onAssign(nextCourierId: string) {
    setCourierId(nextCourierId);
    if (!nextCourierId) return;
    startTransition(async () => {
      const result = await assignCourier({ jobId: job.id, courierId: nextCourierId });
      if (result.ok) toast.success("Courier assigned.");
      else toast.error(result.message);
    });
  }

  function onComplete() {
    startTransition(async () => {
      const result = await completeDeliveryJob(job.id);
      if (result.ok) toast.success("Delivery marked complete.");
      else toast.error(result.message);
    });
  }

  return (
    <div className="flex items-center gap-2">
      <Select
        value={courierId}
        onChange={onAssign}
        disabled={isPending || job.status === "completed"}
        placeholder="Assign courier"
        size="sm"
        options={couriers.map((c) => ({ value: c.id, label: c.name }))}
      />
      <Button variant="secondary" size="sm" disabled={job.status === "completed"} isLoading={isPending} onClick={onComplete}>
        <Check className="h-3.5 w-3.5" /> Complete
      </Button>
    </div>
  );
}
