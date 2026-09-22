"use server";

import { revalidatePath } from "next/cache";
import { apiFetch } from "@/lib/api/client";
import { describeApiError } from "@/lib/api/errors";
import { getToken } from "@/lib/auth/session";

type SimpleResult = { ok: true } | { ok: false; message: string };

// Mirrors PATCH /console/occasion-tiles/:occasion — sets (or replaces) the
// cover image + blurb the shop's "Shop by Occasion" home section shows for
// this occasion.
export async function saveOccasionTile(occasion: string, input: { imageUrl: string; blurb: string }): Promise<SimpleResult> {
  const token = await getToken();
  if (!token) return { ok: false, message: "Your session has expired. Sign in again." };
  try {
    await apiFetch(`/console/occasion-tiles/${encodeURIComponent(occasion)}`, { method: "PATCH", token, body: input });
  } catch (error) {
    return { ok: false, message: describeApiError(error) };
  }
  revalidatePath("/occasions");
  return { ok: true };
}

// Mirrors DELETE /console/occasion-tiles/:occasion — reverts this occasion
// back to unset; the shop hides its tile entirely until a new image is set.
export async function clearOccasionTile(occasion: string): Promise<SimpleResult> {
  const token = await getToken();
  if (!token) return { ok: false, message: "Your session has expired. Sign in again." };
  try {
    await apiFetch(`/console/occasion-tiles/${encodeURIComponent(occasion)}`, { method: "DELETE", token });
  } catch (error) {
    return { ok: false, message: describeApiError(error) };
  }
  revalidatePath("/occasions");
  return { ok: true };
}
