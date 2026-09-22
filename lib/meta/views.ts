// The photo angles a color variant can have an image for. Matches the
// backend's productViewInput enum (see Loopwear-backend's products/schemas.ts)
// — imageUrls is a Record<view, url>, one image per view, so this is the
// full set the admin can ever fill in per color.
export const VIEW_OPTIONS = [
  { value: "front", label: "Front" },
  { value: "back", label: "Back" },
  { value: "fabric", label: "Fabric" },
  { value: "model", label: "Model" },
  { value: "detail", label: "Detail" },
] as const;
