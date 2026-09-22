import type { Paginated } from "@/types/common";
import type { Product, ProductVariant } from "@/types/product";
import { apiFetch } from "@/lib/api/client";
import { ApiError } from "@/lib/api/errors";
import { getToken } from "@/lib/auth/session";

export interface ListProductsParams {
  page?: number;
  pageSize?: number;
  q?: string;
  categoryId?: string;
}

interface ApiVariant {
  id: string;
  color: string;
  colorHex: string;
  imageUrls: Record<string, string>;
  isActive: boolean;
  sizes: string[];
  unitCount: number;
}

function adaptVariant(v: ApiVariant): ProductVariant {
  return {
    id: v.id,
    color: v.color,
    colorHex: v.colorHex,
    imageUrls: v.imageUrls,
    isActive: v.isActive,
    sizes: v.sizes,
    unitCount: v.unitCount,
  };
}

/**
 * The backend stores measurements as [{label, value}] — matches the live
 * shop's rendering convention. This admin app's own Product type keeps the
 * simpler Record<string, string> shape it was designed around; adapt at
 * this one boundary rather than threading the backend shape through the
 * whole app. Each variant's imageUrls passes through unchanged (keyed by
 * view) — see types/product.ts.
 */
function adaptProduct(api: {
  id: string;
  name: string;
  brand: string;
  categoryId: string;
  category: string;
  occasions: string[];
  styles: string[];
  rentPricePaise: number;
  rentDays: number;
  buyPricePaise: number;
  depositPaise: number;
  deliveryDays: number;
  fabric: string;
  care: string[];
  measurements: { label: string; value: string }[];
  description: string;
  coverImageUrl: string | null;
  conditionCopy: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  variants: ApiVariant[];
  unitCount: number;
}): Product {
  const variants = api.variants.map(adaptVariant);
  const defaultVariant = variants[0];
  return {
    ...api,
    measurements: Object.fromEntries(api.measurements.map((m) => [m.label, m.value])),
    variants,
    color: defaultVariant?.color ?? "",
    colorHex: defaultVariant?.colorHex ?? "",
  };
}

// Mirrors GET /console/products.
export async function listProducts(params: ListProductsParams = {}): Promise<Paginated<Product>> {
  const { page = 1, pageSize = 10, q, categoryId } = params;
  const token = await getToken();
  const data = await apiFetch<Paginated<Parameters<typeof adaptProduct>[0]>>("/console/products", {
    token: token ?? undefined,
    searchParams: { page, pageSize, q, categoryId: categoryId && categoryId !== "all" ? categoryId : undefined },
  });
  return { ...data, items: data.items.map(adaptProduct) };
}

// Mirrors GET /console/products/:id.
export async function getProduct(id: string): Promise<Product | null> {
  const token = await getToken();
  try {
    const data = await apiFetch<Parameters<typeof adaptProduct>[0]>(`/console/products/${id}`, {
      token: token ?? undefined,
    });
    return adaptProduct(data);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) return null;
    throw error;
  }
}
