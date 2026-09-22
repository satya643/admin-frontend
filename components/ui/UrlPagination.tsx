"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Pagination } from "./Pagination";

export function UrlPagination({
  page,
  totalPages,
  total,
  pageSize,
}: {
  page: number;
  totalPages: number;
  total: number;
  pageSize: number;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function goTo(nextPage: number) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(nextPage));
    router.push(`${pathname}?${params.toString()}`);
  }

  return <Pagination page={page} totalPages={totalPages} total={total} pageSize={pageSize} onPageChange={goTo} />;
}
