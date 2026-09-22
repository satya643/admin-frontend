"use server";

import { revalidatePath } from "next/cache";
import type { OrderStatus } from "@/types/order";
import { apiFetch } from "@/lib/api/client";
import { describeApiError } from "@/lib/api/errors";
import { getToken } from "@/lib/auth/session";

type UpdateResult = { ok: true } | { ok: false; message: string };

// Mirrors PATCH /console/orders/:id/status.
export async function updateOrderStatus(input: { orderId: string; status: OrderStatus }): Promise<UpdateResult> {
  const token = await getToken();
  if (!token) return { ok: false, message: "Your session has expired. Sign in again." };
  try {
    await apiFetch(`/console/orders/${input.orderId}/status`, {
      method: "PATCH",
      token,
      body: { status: input.status },
    });
  } catch (error) {
    return { ok: false, message: describeApiError(error) };
  }
  revalidatePath("/orders");
  revalidatePath(`/orders/${input.orderId}`);
  return { ok: true };
}
