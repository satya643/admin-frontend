"use client";

import { useState, useTransition } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Drawer } from "@/components/ui/Drawer";
import { Select } from "@/components/ui/Select";
import { toast } from "sonner";
import { createLaundryBatch } from "@/lib/actions/laundry";
import type { Facility } from "@/types/laundry";
import type { GarmentUnitListItem } from "@/types/garment-unit";
import type { LaundryPriority } from "@/types/laundry";

export function NewBatchDrawer({ facilities, laundryUnits }: { facilities: Facility[]; laundryUnits: GarmentUnitListItem[] }) {
  const [open, setOpen] = useState(false);
  const [facilityId, setFacilityId] = useState(facilities[0]?.id ?? "");
  const [priority, setPriority] = useState<LaundryPriority>("standard");
  const [selectedUnitIds, setSelectedUnitIds] = useState<string[]>([]);
  const [isPending, startTransition] = useTransition();

  function toggleUnit(id: string) {
    setSelectedUnitIds((current) => (current.includes(id) ? current.filter((x) => x !== id) : [...current, id]));
  }

  function onSubmit() {
    startTransition(async () => {
      const result = await createLaundryBatch({ facilityId, garmentUnitIds: selectedUnitIds, priority });
      if (result.ok) {
        toast.success("Laundry batch created.");
        setSelectedUnitIds([]);
        setOpen(false);
      } else {
        toast.error(result.message);
      }
    });
  }

  return (
    <>
      <Button size="sm" onClick={() => setOpen(true)}>
        <Plus className="h-3.5 w-3.5" /> New Batch
      </Button>

      <Drawer open={open} onClose={() => setOpen(false)} title="New Laundry Batch">
        <div className="flex flex-col gap-4">
          <div>
            <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-ink-muted">Facility</label>
            <Select
              value={facilityId}
              onChange={setFacilityId}
              options={facilities.map((f) => ({ value: f.id, label: `${f.name} (${f.city})` }))}
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-ink-muted">Priority</label>
            <div className="flex gap-2">
              {(["standard", "rush"] as LaundryPriority[]).map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setPriority(option)}
                  className={`rounded-[var(--radius-chip)] border px-3 py-1.5 text-sm capitalize ${
                    priority === option ? "border-brand-gold bg-brand-gold/10 text-ink" : "border-rule-strong text-ink-muted"
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-ink-muted">
              Garment Units in Laundry Stage ({selectedUnitIds.length} selected)
            </label>
            {laundryUnits.length === 0 ? (
              <p className="text-sm text-ink-muted">No units are currently in the laundry stage.</p>
            ) : (
              <div className="max-h-64 overflow-y-auto rounded-[var(--radius-chip)] border border-rule">
                {laundryUnits.map((unit) => (
                  <label key={unit.id} className="flex items-center gap-2 border-b border-rule px-3 py-2 text-sm last:border-0">
                    <input
                      type="checkbox"
                      checked={selectedUnitIds.includes(unit.id)}
                      onChange={() => toggleUnit(unit.id)}
                      className="h-4 w-4"
                    />
                    <span className="font-mono text-xs">{unit.sku}</span>
                    <span className="text-ink-muted">{unit.product.name}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          <Button onClick={onSubmit} isLoading={isPending} disabled={!facilityId || selectedUnitIds.length === 0}>
            Create Batch
          </Button>
        </div>
      </Drawer>
    </>
  );
}
