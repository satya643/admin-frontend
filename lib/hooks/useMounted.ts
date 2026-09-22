"use client";

import { useEffect, useState } from "react";

// Portals must render identically on the server and on the client's first
// pass (both skip the portal), then mount it only after hydration completes
// — branching on `typeof document` directly in render causes a hydration
// mismatch because it evaluates differently during SSR vs. hydration.
export function useMounted(): boolean {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted;
}
