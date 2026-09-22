import type { Paginated } from "@/types/common";
import type { Customer } from "@/types/customer";
import { apiFetch } from "@/lib/api/client";
import { ApiError } from "@/lib/api/errors";
import { getToken } from "@/lib/auth/session";

export interface ListCustomersParams {
  page?: number;
  pageSize?: number;
  q?: string;
}

// Mirrors GET /console/customers. Note: the real endpoint only returns this
// computed summary shape (id, name, email, totalRentals, onTimeRate, tier) —
// no phone/address/full profile.
export async function listCustomers(params: ListCustomersParams = {}): Promise<Paginated<Customer>> {
  const { page = 1, pageSize = 10, q } = params;
  const token = await getToken();
  return apiFetch<Paginated<Customer>>("/console/customers", { token: token ?? undefined, searchParams: { page, pageSize, q } });
}

// GET /console/customers/:id has a known backend bug: an unknown id throws
// a raw Prisma NotFoundError, which the error handler serializes as a
// generic 500 rather than a 404. We treat ANY error from this one endpoint
// as "not found" rather than surfacing a scary 500 to the operator — this
// is a deliberate, narrow workaround, not a general "swallow all errors"
// pattern.
export async function getCustomer(id: string): Promise<Customer | null> {
  const token = await getToken();
  try {
    return await apiFetch<Customer>(`/console/customers/${id}`, { token: token ?? undefined });
  } catch (error) {
    if (error instanceof ApiError) return null;
    throw error;
  }
}
