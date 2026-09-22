"use server";

import { apiFetch } from "@/lib/api/client";
import { ApiError } from "@/lib/api/errors";
import { createSessionCookie, clearSessionCookie, getToken } from "./session";
import type { AdminUser } from "@/types/auth";

interface SignInResult {
  ok: boolean;
  message?: string;
}

/**
 * There is no dedicated admin login endpoint in Loopwear-backend today —
 * POST /api/auth/sign-in is the same one the customer app uses, shared
 * across all roles. We still refuse to establish an admin session for a
 * non-operator/admin account here, on top of the backend's own per-route
 * RBAC check, so a customer's valid credentials can never leave them with
 * an eo_admin_token cookie. Swap the path below if/when a dedicated admin
 * auth endpoint ships — nothing else in the admin app needs to change.
 */
export async function signIn(email: string, password: string): Promise<SignInResult> {
  let result: { token: string; user: AdminUser };
  try {
    result = await apiFetch<{ token: string; user: AdminUser }>("/auth/sign-in", {
      method: "POST",
      body: { email, password },
    });
  } catch (error) {
    if (error instanceof ApiError) {
      return { ok: false, message: error.status === 401 ? "Incorrect email or password." : error.message };
    }
    return { ok: false, message: "Could not reach the server." };
  }

  if (result.user.role !== "operator" && result.user.role !== "admin") {
    return { ok: false, message: "This account doesn't have console access." };
  }

  await createSessionCookie(result.token);
  return { ok: true };
}

export async function signOut(): Promise<void> {
  const token = await getToken();
  if (token) {
    // Best-effort — revokes the session server-side so the token can't be
    // replayed. Cookie is cleared regardless of whether this call succeeds.
    try {
      await apiFetch("/auth/logout", { method: "POST", token });
    } catch (error) {
      console.error("signOut: logout call failed, clearing cookie anyway —", error);
    }
  }
  await clearSessionCookie();
}
