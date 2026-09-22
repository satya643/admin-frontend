"use server";

import { revalidatePath } from "next/cache";
import type { LaundryPriority } from "@/types/laundry";
import { apiFetch } from "@/lib/api/client";
import { describeApiError } from "@/lib/api/errors";
import { getToken } from "@/lib/auth/session";

type ActionResult = { ok: true } | { ok: false; message: string };

// Mirrors POST /console/laundry/batches.
export async function createLaundryBatch(input: {
  facilityId: string;
  garmentUnitIds: string[];
  priority: LaundryPriority;
}): Promise<ActionResult> {
  if (input.garmentUnitIds.length === 0) return { ok: false, message: "Select at least one garment unit." };

  const token = await getToken();
  if (!token) return { ok: false, message: "Your session has expired. Sign in again." };
  try {
    await apiFetch("/console/laundry/batches", {
      method: "POST",
      token,
      body: { facilityId: input.facilityId, garmentUnitIds: input.garmentUnitIds, priority: input.priority },
    });
  } catch (error) {
    return { ok: false, message: describeApiError(error) };
  }
  revalidatePath("/laundry");
  return { ok: true };
}

// Mirrors POST /console/laundry/batches/:id/advance (no body — always moves
// to the next stage in the fixed sequence).
export async function advanceLaundryBatch(batchId: string): Promise<ActionResult> {
  const token = await getToken();
  if (!token) return { ok: false, message: "Your session has expired. Sign in again." };
  try {
    await apiFetch(`/console/laundry/batches/${batchId}/advance`, { method: "POST", token });
  } catch (error) {
    return { ok: false, message: describeApiError(error) };
  }
  revalidatePath("/laundry");
  return { ok: true };
}
