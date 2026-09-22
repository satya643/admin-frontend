"use server";

import { revalidatePath } from "next/cache";
import { apiFetch } from "@/lib/api/client";
import { getToken } from "@/lib/auth/session";

// Mirrors POST /console/notifications/:id/read.
export async function markNotificationRead(id: string): Promise<void> {
  const token = await getToken();
  if (token) await apiFetch(`/console/notifications/${id}/read`, { method: "POST", token });

  revalidatePath("/notifications");
  revalidatePath("/dashboard");
}
