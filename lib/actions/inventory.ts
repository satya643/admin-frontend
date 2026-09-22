"use server";

import { revalidatePath } from "next/cache";
import type { GarmentStage, GarmentCondition } from "@/types/garment-unit";
import { apiFetch } from "@/lib/api/client";
import { describeApiError } from "@/lib/api/errors";
import { getToken } from "@/lib/auth/session";

type TransitionResult = { ok: true } | { ok: false; message: string };

// Mirrors POST /console/garment-units/:id/transition. The backend enforces
// the legal-transition rule server-side regardless of what we send.
export async function transitionGarmentUnit(input: {
  unitId: string;
  toStage: GarmentStage;
  condition?: GarmentCondition;
  note?: string;
}): Promise<TransitionResult> {
  const token = await getToken();
  if (!token) return { ok: false, message: "Your session has expired. Sign in again." };
  try {
    await apiFetch(`/console/garment-units/${input.unitId}/transition`, {
      method: "POST",
      token,
      body: { toStage: input.toStage, condition: input.condition, note: input.note },
    });
  } catch (error) {
    return { ok: false, message: describeApiError(error) };
  }
  revalidatePath("/inventory");
  revalidatePath(`/inventory/${input.unitId}`);
  return { ok: true };
}
