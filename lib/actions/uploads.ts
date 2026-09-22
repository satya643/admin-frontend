"use server";

import { API_BASE_URL } from "@/lib/api/config";
import { ApiError, describeApiError } from "@/lib/api/errors";
import { getToken } from "@/lib/auth/session";
import type { ApiErrorShape } from "@/types/common";

type UploadResult = { ok: true; url: string } | { ok: false; message: string };

const MAX_FILE_BYTES = 5 * 1024 * 1024;

/**
 * Mirrors POST /console/uploads. Unlike every other action in this
 * directory, the request body here is multipart/form-data, not JSON — the
 * backend needs the raw image bytes, not a URL — so this bypasses apiFetch
 * (lib/api/client.ts, which always JSON-encodes) and talks to the backend
 * directly. Returns the Cloudinary URL the caller then saves onto a
 * variant's imageUrls via createVariant/updateVariantImages.
 */
export async function uploadImage(file: File): Promise<UploadResult> {
  const token = await getToken();
  if (!token) return { ok: false, message: "Your session has expired. Sign in again." };
  if (!file.type.startsWith("image/")) return { ok: false, message: "Only image files are accepted." };
  if (file.size > MAX_FILE_BYTES) return { ok: false, message: "Image must be 5MB or smaller." };

  const body = new FormData();
  body.append("file", file);

  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}/console/uploads`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body,
    });
  } catch {
    return { ok: false, message: "Could not reach the server. Check your connection." };
  }

  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    const errorPayload = payload as ApiErrorShape | null;
    const error = new ApiError(
      response.status,
      errorPayload?.error?.code ?? "internal_error",
      errorPayload?.error?.message ?? "Something went wrong.",
      errorPayload?.error?.details,
    );
    return { ok: false, message: describeApiError(error) };
  }

  return { ok: true, url: (payload as { url: string }).url };
}
