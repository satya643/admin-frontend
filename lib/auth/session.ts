import { cookies } from "next/headers";
import { cache } from "react";
import { redirect } from "next/navigation";
import { apiFetch } from "@/lib/api/client";
import { ApiError } from "@/lib/api/errors";
import type { AdminUser } from "@/types/auth";

// Deliberately its own cookie, its own module, never imported by or
// importing from the customer frontend — the two apps must never be able
// to read or clobber each other's session, even if someday deployed under
// the same parent domain. If a backend adds a dedicated admin auth
// endpoint later, only lib/auth/actions.ts's signIn() needs to change.
const COOKIE_NAME = "eo_admin_token";
const COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 7; // 7 days — matches the backend's JWT_TTL_DAYS default

export async function createSessionCookie(token: string): Promise<void> {
  (await cookies()).set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: COOKIE_MAX_AGE_SECONDS,
  });
}

/** Raw bearer token for this session, or null if signed out. */
export async function getToken(): Promise<string | null> {
  return (await cookies()).get(COOKIE_NAME)?.value ?? null;
}

/**
 * The backend is the source of truth for who's logged in — the token is
 * opaque to us, we don't decode or locally verify it. `cache()` dedupes
 * repeat calls within one request (layout + page both calling getSession()
 * is one network round trip, not two).
 */
export const getSession = cache(async (): Promise<AdminUser | null> => {
  const token = await getToken();
  if (!token) return null;

  try {
    const { user } = await apiFetch<{ user: AdminUser }>("/auth/session", { token });
    return user;
  } catch (error) {
    if (error instanceof ApiError && (error.status === 401 || error.status === 403)) return null;
    // Backend unreachable/erroring: fail closed (treat as logged out) rather
    // than throwing on every page render.
    console.error("getSession: backend error, treating as signed out —", error);
    return null;
  }
});

export async function clearSessionCookie(): Promise<void> {
  (await cookies()).delete(COOKIE_NAME);
}

/**
 * Call at the top of the authenticated layout. Redirects to /login unless
 * the signed-in user's role is operator or admin — the backend enforces
 * this too on every /console/* call, so this is a UX shortcut, not the
 * real security boundary.
 */
export async function requireAdmin(): Promise<AdminUser> {
  const user = await getSession();
  if (!user || (user.role !== "operator" && user.role !== "admin")) {
    redirect("/login");
  }
  return user;
}
