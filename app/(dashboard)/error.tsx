"use client";

import { useEffect } from "react";
import { ErrorState } from "@/components/ui/ErrorState";

// Catches anything a page in this layout throws — most commonly an ApiError
// from lib/api/client when the backend is unreachable or returns 5xx. A 401
// mid-session (token revoked after the layout's requireAdmin() check already
// passed) also lands here rather than a dedicated Unauthorized screen; that's
// a narrow enough race not to warrant its own boundary today.
export default function DashboardError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return <ErrorState message={error.message || "Something went wrong loading this page."} onRetry={reset} />;
}
