import type { Paginated } from "@/types/common";
import type { Payment, PaymentMethod, PaymentStatus } from "@/types/payment";
import { apiFetch } from "@/lib/api/client";
import { getToken } from "@/lib/auth/session";

export interface ListPaymentsParams {
  page?: number;
  pageSize?: number;
  status?: PaymentStatus | "all";
  method?: PaymentMethod | "all";
}

// Mirrors GET /console/payments.
export async function listPayments(params: ListPaymentsParams = {}): Promise<Paginated<Payment>> {
  const { page = 1, pageSize = 10, status, method } = params;
  const token = await getToken();
  return apiFetch<Paginated<Payment>>("/console/payments", {
    token: token ?? undefined,
    searchParams: {
      page,
      pageSize,
      status: status && status !== "all" ? status : undefined,
      method: method && method !== "all" ? method : undefined,
    },
  });
}

// No GET /console/payments/:id exists on the backend — the detail page
// fetches a page of the list and finds the one it needs. Capped at the
// backend's own pageSize ceiling (see lib/pagination.ts: max 100) — asking
// for more throws a 400 validation_error rather than silently clamping.
// Fine at this data volume; would need a real single-payment GET (or
// paging through results) if payment volume grows past 100.
export async function getPayment(id: string): Promise<Payment | null> {
  const { items } = await listPayments({ pageSize: 100 });
  return items.find((payment) => payment.id === id) ?? null;
}
