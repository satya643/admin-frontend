"use server";

import { revalidatePath } from "next/cache";
import { apiFetch } from "@/lib/api/client";
import { describeApiError } from "@/lib/api/errors";
import { getToken } from "@/lib/auth/session";

type RefundResult = { ok: true } | { ok: false; message: string };

// Mirrors POST /console/payments/order-items/:id/refund.
export async function refundOrderItem(orderItemId: string): Promise<RefundResult> {
  const token = await getToken();
  if (!token) return { ok: false, message: "Your session has expired. Sign in again." };
  try {
    await apiFetch(`/console/payments/order-items/${orderItemId}/refund`, { method: "POST", token });
  } catch (error) {
    return { ok: false, message: describeApiError(error) };
  }
  revalidatePath("/payments");
  return { ok: true };
}
