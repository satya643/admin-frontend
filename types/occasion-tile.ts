// One tile of the shop's "Shop by Occasion" home section — one row per
// Occasion enum value at most. imageUrl/blurb are null until an admin
// uploads a cover image for that occasion; the shop hides the tile
// entirely until then rather than showing placeholder art.
export interface OccasionTile {
  occasion: string;
  label: string;
  imageUrl: string | null;
  blurb: string | null;
  updatedAt: string | null;
}
