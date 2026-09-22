"use client";

import { useCallback, useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

// Reads/writes a single query param and always resets `page` to 1 when it
// changes, so filter controls never leave the user on a stale page.
export function useUrlParam(key: string, defaultValue = ""): [string, (value: string) => void] {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const value = searchParams.get(key) ?? defaultValue;

  const setValue = useCallback(
    (next: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (next && next !== defaultValue) params.set(key, next);
      else params.delete(key);
      params.delete("page");
      router.push(`${pathname}?${params.toString()}`);
    },
    [key, defaultValue, pathname, router, searchParams],
  );

  return [value, setValue];
}

// Like useUrlParam, but keeps local state for instant typing feedback and
// only pushes to the URL (triggering a server refetch) after the user
// pauses — used for free-text search boxes.
export function useDebouncedUrlParam(key: string, defaultValue = "", delayMs = 400): [string, (value: string) => void] {
  const [urlValue, setUrlValue] = useUrlParam(key, defaultValue);
  const [draft, setDraft] = useState(urlValue);

  useEffect(() => {
    setDraft(urlValue);
  }, [urlValue]);

  useEffect(() => {
    if (draft === urlValue) return;
    const timeout = setTimeout(() => setUrlValue(draft), delayMs);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draft]);

  return [draft, setDraft];
}
