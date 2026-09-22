import { API_BASE_URL } from "./config";
import { ApiError } from "./errors";
import type { ApiErrorShape } from "@/types/common";

interface ApiFetchOptions {
  method?: "GET" | "POST" | "PATCH" | "DELETE";
  body?: unknown;
  token?: string;
  searchParams?: Record<string, string | number | boolean | undefined>;
}

function buildUrl(path: string, searchParams?: ApiFetchOptions["searchParams"]): string {
  const url = new URL(`${API_BASE_URL}${path}`);
  if (searchParams) {
    for (const [key, value] of Object.entries(searchParams)) {
      if (value !== undefined) url.searchParams.set(key, String(value));
    }
  }
  return url.toString();
}

// Single point of contact with the existing EveryOccasion backend. Every
// console/* call the admin panel makes once wired up should go through
// this function — never a bare fetch() inside a component.
export async function apiFetch<T>(path: string, options: ApiFetchOptions = {}): Promise<T> {
  const { method = "GET", body, token, searchParams } = options;

  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (token) headers.Authorization = `Bearer ${token}`;

  let response: Response;
  try {
    response = await fetch(buildUrl(path, searchParams), {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new ApiError(0, "internal_error", "Could not reach the server. Check your connection.");
  }

  if (response.status === 204) return undefined as T;

  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    const errorPayload = payload as ApiErrorShape | null;
    throw new ApiError(
      response.status,
      errorPayload?.error?.code ?? "internal_error",
      errorPayload?.error?.message ?? "Something went wrong.",
      errorPayload?.error?.details,
    );
  }

  return payload as T;
}
