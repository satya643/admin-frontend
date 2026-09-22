import type { ApiErrorCode } from "@/types/common";

export class ApiError extends Error {
  status: number;
  code: ApiErrorCode;
  details?: unknown;

  constructor(status: number, code: ApiErrorCode, message: string, details?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

/**
 * The backend's generic validation_error message is always the literal
 * string "Invalid request" — the actually-useful part (which field, why)
 * lives in `details` (a Zod `.flatten()` shape: { fieldErrors, formErrors }).
 * Every server action's catch block should show this instead of the bare
 * message, or an operator has no way to tell what they typed wrong.
 */
export function describeApiError(error: unknown, fallback = "Something went wrong."): string {
  if (!(error instanceof ApiError)) return fallback;

  const details = error.details as { fieldErrors?: Record<string, string[]>; formErrors?: string[] } | undefined;
  const fieldMessages = details?.fieldErrors
    ? Object.entries(details.fieldErrors)
        .filter(([, msgs]) => msgs && msgs.length > 0)
        .map(([field, msgs]) => `${field}: ${msgs.join(", ")}`)
    : [];
  const formMessages = details?.formErrors ?? [];
  const allDetails = [...fieldMessages, ...formMessages];

  return allDetails.length > 0 ? allDetails.join("; ") : error.message;
}
