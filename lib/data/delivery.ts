import type { Courier, DeliveryJob, DeliveryStatus, DeliveryType } from "@/types/delivery";
import { apiFetch } from "@/lib/api/client";
import { getToken } from "@/lib/auth/session";

export interface ListDeliveryJobsParams {
  status?: DeliveryStatus | "all";
  type?: DeliveryType | "all";
}

// Mirrors GET /console/delivery-jobs (no pagination on the real endpoint,
// plain { items }).
export async function listDeliveryJobs(params: ListDeliveryJobsParams = {}): Promise<DeliveryJob[]> {
  const { status, type } = params;
  const token = await getToken();
  const { items } = await apiFetch<{ items: DeliveryJob[] }>("/console/delivery-jobs", {
    token: token ?? undefined,
    searchParams: { status: status && status !== "all" ? status : undefined, type: type && type !== "all" ? type : undefined },
  });
  return items;
}

// Mirrors GET /console/couriers (plain { items }, no pagination).
export async function listCouriers(): Promise<Courier[]> {
  const token = await getToken();
  const { items } = await apiFetch<{ items: Courier[] }>("/console/couriers", { token: token ?? undefined });
  return items;
}
