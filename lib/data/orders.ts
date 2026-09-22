import type { Paginated } from "@/types/common";
import type { OrderDetail, OrderListItem, OrderStatus } from "@/types/order";
import { ALLOWED_ORDER_TRANSITIONS } from "@/lib/meta/order-status";
import { apiFetch } from "@/lib/api/client";
import { ApiError } from "@/lib/api/errors";
import { getToken } from "@/lib/auth/session";

export interface ListOrdersParams {
  page?: number;
  pageSize?: number;
  status?: OrderStatus | "all";
  q?: string;
}

// Mirrors GET /console/orders (list response omits items, matching the
// backend's serializeOrder for the list endpoint).
export async function listOrders(params: ListOrdersParams = {}): Promise<Paginated<OrderListItem>> {
  const { page = 1, pageSize = 10, status, q } = params;
  const token = await getToken();
  return apiFetch<Paginated<OrderListItem>>("/console/orders", {
    token: token ?? undefined,
    searchParams: { page, pageSize, status: status && status !== "all" ? status : undefined, q },
  });
}

// Mirrors GET /console/orders/:id. Note: the backend's response omits
// `payments`/`deliveryJobs` even though it queries them (a known backend
// bug) — callers cross-reference those via listPayments/listDeliveryJobs
// filtered by orderId instead.
export async function getOrder(id: string): Promise<OrderDetail | null> {
  const token = await getToken();
  try {
    return await apiFetch<OrderDetail>(`/console/orders/${id}`, { token: token ?? undefined });
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) return null;
    throw error;
  }
}

export function allowedNextOrderStatuses(current: OrderStatus): OrderStatus[] {
  return ALLOWED_ORDER_TRANSITIONS[current];
}
