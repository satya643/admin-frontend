"use client";

import { useState, useTransition } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Drawer } from "@/components/ui/Drawer";
import { toast } from "sonner";
import { createCourier } from "@/lib/actions/delivery";

const FIELD_CLASS = "w-full rounded-[var(--radius-chip)] border border-rule-strong bg-paper-raised px-3 py-2 text-sm text-ink";
const LABEL_CLASS = "mb-1.5 block text-xs font-medium uppercase tracking-wide text-ink-muted";

export function NewCourierDrawer() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [zones, setZones] = useState("");
  const [isPending, startTransition] = useTransition();

  function onSubmit() {
    startTransition(async () => {
      const result = await createCourier({
        name: name.trim(),
        zones: zones.split(",").map((z) => z.trim()).filter(Boolean),
      });
      if (result.ok) {
        toast.success(`${result.courier.name} added.`);
        setName("");
        setZones("");
        setOpen(false);
      } else {
        toast.error(result.message);
      }
    });
  }

  return (
    <>
      <Button size="sm" onClick={() => setOpen(true)}>
        <Plus className="h-3.5 w-3.5" /> New Courier
      </Button>

      <Drawer open={open} onClose={() => setOpen(false)} title="New Courier">
        <div className="flex flex-col gap-4">
          <div>
            <label className={LABEL_CLASS}>Name</label>
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Ravi Kumar" className={FIELD_CLASS} />
          </div>
          <div>
            <label className={LABEL_CLASS}>Zones (comma-separated)</label>
            <input value={zones} onChange={(e) => setZones(e.target.value)} placeholder="Indiranagar, Koramangala" className={FIELD_CLASS} />
          </div>
          <Button onClick={onSubmit} isLoading={isPending} disabled={!name.trim()}>
            Add courier
          </Button>
        </div>
      </Drawer>
    </>
  );
}
