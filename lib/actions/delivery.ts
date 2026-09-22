"use server";

import { revalidatePath } from "next/cache";
import type { Courier } from "@/types/delivery";
import { apiFetch } from "@/lib/api/client";
import { describeApiError } from "@/lib/api/errors";
import { getToken } from "@/lib/auth/session";

type ActionResult = { ok: true } | { ok: false; message: string };

// Mirrors PATCH /console/delivery-jobs/:id/courier.
export async function assignCourier(input: { jobId: string; courierId: string }): Promise<ActionResult> {
  const token = await getToken();
  if (!token) return { ok: false, message: "Your session has expired. Sign in again." };
  try {
    await apiFetch(`/console/delivery-jobs/${input.jobId}/courier`, {
      method: "PATCH",
      token,
      body: { courierId: input.courierId },
    });
  } catch (error) {
    return { ok: false, message: describeApiError(error) };
  }
  revalidatePath("/delivery");
  return { ok: true };
}

// Mirrors PATCH /console/delivery-jobs/:id/complete.
export async function completeDeliveryJob(jobId: string): Promise<ActionResult> {
  const token = await getToken();
  if (!token) return { ok: false, message: "Your session has expired. Sign in again." };
  try {
    await apiFetch(`/console/delivery-jobs/${jobId}/complete`, { method: "PATCH", token });
  } catch (error) {
    return { ok: false, message: describeApiError(error) };
  }
  revalidatePath("/delivery");
  return { ok: true };
}

type CreateCourierResult = { ok: true; courier: Courier } | { ok: false; message: string };

// Mirrors POST /console/couriers.
export async function createCourier(input: { name: string; zones: string[] }): Promise<CreateCourierResult> {
  const token = await getToken();
  if (!token) return { ok: false, message: "Your session has expired. Sign in again." };
  try {
    const courier = await apiFetch<Courier>("/console/couriers", { method: "POST", token, body: input });
    revalidatePath("/delivery/couriers");
    return { ok: true, courier };
  } catch (error) {
    return { ok: false, message: describeApiError(error) };
  }
}
