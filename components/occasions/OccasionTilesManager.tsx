"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/Button";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { VariantImageField } from "@/components/products/VariantImageField";
import { saveOccasionTile, clearOccasionTile } from "@/lib/actions/occasion-tiles";
import type { OccasionTile } from "@/types/occasion-tile";

const FIELD_CLASS =
  "w-full rounded-[var(--radius-chip)] border border-rule-strong bg-paper-raised px-3 py-2 text-sm text-ink";
const LABEL_CLASS = "mb-1.5 block text-xs font-medium uppercase tracking-wide text-ink-muted";

function OccasionTileCard({ tile }: { tile: OccasionTile }) {
  const router = useRouter();
  const [imageUrl, setImageUrl] = useState(tile.imageUrl ?? "");
  const [blurb, setBlurb] = useState(tile.blurb ?? "");
  const [isSaving, startSave] = useTransition();
  const [isClearing, startClear] = useTransition();

  function handleSave() {
    if (!imageUrl) {
      toast.error("Upload a cover image first.");
      return;
    }
    if (!blurb.trim()) {
      toast.error("Add a short blurb.");
      return;
    }
    startSave(async () => {
      const result = await saveOccasionTile(tile.occasion, { imageUrl, blurb: blurb.trim() });
      if (!result.ok) {
        toast.error(result.message);
        return;
      }
      toast.success(`"${tile.label}" tile is live on the shop.`);
      router.refresh();
    });
  }

  function handleClear() {
    startClear(async () => {
      const result = await clearOccasionTile(tile.occasion);
      if (!result.ok) {
        toast.error(result.message);
        return;
      }
      setImageUrl("");
      setBlurb("");
      toast.success(`"${tile.label}" removed from the shop.`);
      router.refresh();
    });
  }

  const isLive = Boolean(tile.imageUrl);

  return (
    <div className="flex flex-col gap-3 rounded-[var(--radius-ticket)] border border-rule bg-paper-raised p-4">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-base text-ink">{tile.label}</h3>
        <StatusBadge label={isLive ? "Live" : "Not shown"} tone={isLive ? "success" : "neutral"} />
      </div>

      <VariantImageField label="Cover image" url={imageUrl} onChange={setImageUrl} />

      <div>
        <label className={LABEL_CLASS}>Blurb</label>
        <input
          value={blurb}
          onChange={(e) => setBlurb(e.target.value)}
          className={FIELD_CLASS}
          placeholder="Statement pieces"
          maxLength={160}
        />
      </div>

      <div className="flex gap-2">
        <Button size="sm" onClick={handleSave} isLoading={isSaving}>
          Save
        </Button>
        {tile.imageUrl ? (
          <Button variant="secondary" size="sm" onClick={handleClear} isLoading={isClearing}>
            Remove from shop
          </Button>
        ) : null}
      </div>
    </div>
  );
}

export function OccasionTilesManager({ tiles }: { tiles: OccasionTile[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {tiles.map((tile) => (
        <OccasionTileCard key={tile.occasion} tile={tile} />
      ))}
    </div>
  );
}
