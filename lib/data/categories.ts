import type { Category } from "@/types/category";
import { apiFetch } from "@/lib/api/client";
import { getToken } from "@/lib/auth/session";

// Mirrors GET /console/categories (plain { items }, no pagination) — the
// single source of truth for categories, same table the public shop's
// category navigation reads from.
export async function listCategories(): Promise<Category[]> {
  const token = await getToken();
  const { items } = await apiFetch<{ items: Category[] }>("/console/categories", { token: token ?? undefined });
  return items;
}
