import type { Facility, LaundryBatch } from "@/types/laundry";
import { apiFetch } from "@/lib/api/client";
import { getToken } from "@/lib/auth/session";

// Mirrors GET /console/laundry/batches (plain { items }, no pagination).
export async function listLaundryBatches(): Promise<LaundryBatch[]> {
  const token = await getToken();
  const { items } = await apiFetch<{ items: LaundryBatch[] }>("/console/laundry/batches", { token: token ?? undefined });
  return items;
}

// No single-batch GET exists on the backend — the detail page fetches the
// full list and finds the one it needs. Fine at this data volume; would
// need a real GET /console/laundry/batches/:id if batch volume grows.
export async function getLaundryBatch(id: string): Promise<LaundryBatch | null> {
  const batches = await listLaundryBatches();
  return batches.find((batch) => batch.id === id) ?? null;
}

// Mirrors GET /console/facilities (plain { items }, no pagination).
export async function listFacilities(): Promise<Facility[]> {
  const token = await getToken();
  const { items } = await apiFetch<{ items: Facility[] }>("/console/facilities", { token: token ?? undefined });
  return items;
}
