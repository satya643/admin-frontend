"use client";

import { useTransition } from "react";
import { ImagePlus, Loader2, X } from "lucide-react";
import { toast } from "sonner";
import { uploadImage } from "@/lib/actions/uploads";

/**
 * One (view, url) slot — a thumbnail with a remove button once an image is
 * set, a drop-in file picker otherwise. The file never touches the caller;
 * this uploads it to Cloudinary itself (see lib/actions/uploads.ts) and
 * only ever hands back the resulting URL, so callers keep the same
 * Record<view, url> state shape whether an image came from here or was
 * pasted directly.
 */
export function VariantImageField({
  label,
  url,
  onChange,
}: {
  label: string;
  url: string;
  onChange: (url: string) => void;
}) {
  const [isUploading, startUpload] = useTransition();

  function handleFile(file: File | undefined) {
    if (!file) return;
    startUpload(async () => {
      const result = await uploadImage(file);
      if (!result.ok) {
        toast.error(result.message);
        return;
      }
      onChange(result.url);
    });
  }

  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-[10px] font-medium uppercase tracking-wide text-ink-muted">{label}</span>
      {url ? (
        <div className="relative h-20 w-20 overflow-hidden rounded-[var(--radius-chip)] border border-rule-strong bg-paper-raised">
          {/* eslint-disable-next-line @next/next/no-img-element -- arbitrary Cloudinary URLs, not a next/image-configured domain */}
          <img src={url} alt={label} className="h-full w-full object-cover" />
          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute right-1 top-1 rounded-full bg-brand-navy/70 p-0.5 text-white hover:bg-brand-navy"
            aria-label={`Remove ${label} image`}
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      ) : (
        <label className="flex h-20 w-20 cursor-pointer flex-col items-center justify-center gap-1 rounded-[var(--radius-chip)] border border-dashed border-rule-strong text-ink-muted hover:border-brand-gold-deep hover:text-ink">
          {isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ImagePlus className="h-4 w-4" />}
          <span className="text-[10px]">{isUploading ? "Uploading…" : "Upload"}</span>
          <input
            type="file"
            accept="image/*"
            className="hidden"
            disabled={isUploading}
            onChange={(e) => handleFile(e.target.files?.[0])}
          />
        </label>
      )}
    </div>
  );
}
