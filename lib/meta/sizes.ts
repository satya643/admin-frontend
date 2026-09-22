// Standard size options the admin can offer per color variant. The backend
// stores size as a free string (see GarmentUnit.size / VariantSize.size in
// prisma/schema.prisma) — this list is a frontend convenience, not a
// backend-enforced enum, so a new size typed elsewhere wouldn't be rejected,
// but the admin UI only ever offers these to keep sizes consistent.
export const SIZE_OPTIONS = [
  "XS",
  "S",
  "M",
  "L",
  "XL",
  "XXL",
  "XXXL",
  "Free Size",
  "28",
  "30",
  "32",
  "34",
  "36",
  "38",
  "40",
  "42",
  "44",
];
