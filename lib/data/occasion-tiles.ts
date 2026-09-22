import { apiFetch } from "@/lib/api/client";
import { getToken } from "@/lib/auth/session";
import type { OccasionTile } from "@/types/occasion-tile";

// Mirrors GET /console/occasion-tiles — always returns all 7 occasions,
// null imageUrl/blurb for any the admin hasn't uploaded a tile for yet.
export async function listOccasionTiles(): Promise<OccasionTile[]> {
  const token = await getToken();
  const data = await apiFetch<{ items: OccasionTile[] }>("/console/occasion-tiles", { token: token ?? undefined });
  return data.items;
}
