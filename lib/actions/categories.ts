"use server";

import { revalidatePath } from "next/cache";
import type { Category, CategoryFormInput } from "@/types/category";
import { apiFetch } from "@/lib/api/client";
import { describeApiError } from "@/lib/api/errors";
import { getToken } from "@/lib/auth/session";

type CreateCategoryResult = { ok: true; category: Category } | { ok: false; message: string };

// Mirrors POST /console/categories.
export async function createCategory(input: CategoryFormInput): Promise<CreateCategoryResult> {
  const token = await getToken();
  if (!token) return { ok: false, message: "Your session has expired. Sign in again." };
  try {
    const category = await apiFetch<Category>("/console/categories", { method: "POST", token, body: input });
    revalidatePath("/products");
    revalidatePath("/products/new");
    return { ok: true, category };
  } catch (error) {
    return { ok: false, message: describeApiError(error) };
  }
}
