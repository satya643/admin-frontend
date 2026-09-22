"use server";

import { revalidatePath } from "next/cache";
import type { CreateProductInput, ProductFormInput, ProductVariant, ProductVariantInput } from "@/types/product";
import { apiFetch } from "@/lib/api/client";
import { describeApiError } from "@/lib/api/errors";
import { getToken } from "@/lib/auth/session";

type ActionResult = { ok: true; id: string } | { ok: false; message: string };
type SimpleResult = { ok: true } | { ok: false; message: string };
type VariantResult = { ok: true; variant: ProductVariant } | { ok: false; message: string };

function toBackendVariant(v: ProductVariantInput) {
  const imageUrls = v.imageUrls ?? {};
  return { color: v.color, colorHex: v.colorHex, sizes: v.sizes, isActive: v.isActive, views: Object.keys(imageUrls), imageUrls };
}

// Mirrors POST /console/products — product fields plus its initial color
// variants, built client-side via "+ Add Another Color" before one submit.
export async function createProduct(input: CreateProductInput): Promise<ActionResult> {
  const token = await getToken();
  if (!token) return { ok: false, message: "Your session has expired. Sign in again." };
  try {
    const { variants, ...productFields } = input;
    const product = await apiFetch<{ id: string }>("/console/products", {
      method: "POST",
      token,
      body: { ...productFields, variants: variants.map(toBackendVariant) },
    });
    revalidatePath("/products");
    return { ok: true, id: product.id };
  } catch (error) {
    return { ok: false, message: describeApiError(error) };
  }
}

// Mirrors PATCH /console/products/:id — scalar fields only. Colors are
// never sent here; see createVariant/updateVariantSizes/deleteVariant below.
export async function updateProduct(id: string, input: ProductFormInput): Promise<SimpleResult> {
  const token = await getToken();
  if (!token) return { ok: false, message: "Your session has expired. Sign in again." };
  try {
    await apiFetch(`/console/products/${id}`, { method: "PATCH", token, body: input });
  } catch (error) {
    return { ok: false, message: describeApiError(error) };
  }
  revalidatePath("/products");
  revalidatePath(`/products/${id}`);
  return { ok: true };
}

// Mirrors PATCH /console/products/:id with only { isActive } — the
// dedicated Publish/Unpublish action on the product detail page (see
// ProductActions). isActive is what actually gates visibility on the shop
// (catalog/service.ts filters every public list/detail query on it), so
// this is the real "publish" switch; the checkbox inside the full edit form
// (ProductForm) sets the same field, this just doesn't require opening it.
export async function setProductActive(id: string, isActive: boolean): Promise<SimpleResult> {
  const token = await getToken();
  if (!token) return { ok: false, message: "Your session has expired. Sign in again." };
  try {
    await apiFetch(`/console/products/${id}`, { method: "PATCH", token, body: { isActive } });
  } catch (error) {
    return { ok: false, message: describeApiError(error) };
  }
  revalidatePath("/products");
  revalidatePath(`/products/${id}`);
  return { ok: true };
}

// Mirrors DELETE /console/products/:id — a real, permanent delete. The
// backend refuses (409) if the product has any order history, cart or
// wishlist saves, outfit references, reviews, or physical inventory; use
// setProductActive (Publish/Unpublish) instead for just hiding it.
export async function deleteProduct(id: string): Promise<SimpleResult> {
  const token = await getToken();
  if (!token) return { ok: false, message: "Your session has expired. Sign in again." };
  try {
    await apiFetch(`/console/products/${id}`, { method: "DELETE", token });
  } catch (error) {
    return { ok: false, message: describeApiError(error) };
  }
  revalidatePath("/products");
  return { ok: true };
}

// Mirrors POST /console/products/:id/variants — adds one new color to an
// existing product ("+ Add Another Color" after the product already exists).
export async function createVariant(productId: string, input: ProductVariantInput): Promise<VariantResult> {
  const token = await getToken();
  if (!token) return { ok: false, message: "Your session has expired. Sign in again." };
  try {
    const raw = await apiFetch<{ id: string; color: string; colorHex: string; imageUrls: Record<string, string>; isActive: boolean; sizes: { size: string }[] }>(
      `/console/products/${productId}/variants`,
      { method: "POST", token, body: toBackendVariant(input) }
    );
    revalidatePath(`/products/${productId}`);
    return {
      ok: true,
      variant: {
        id: raw.id,
        color: raw.color,
        colorHex: raw.colorHex,
        imageUrls: raw.imageUrls,
        isActive: raw.isActive,
        sizes: raw.sizes.map((s) => s.size),
        unitCount: 0,
      },
    };
  } catch (error) {
    return { ok: false, message: describeApiError(error) };
  }
}

// Mirrors PATCH /console/products/:id/variants/:variantId — replaces color,
// colorHex, sizes and images together in one call. Used by the "Edit
// Product" form so an existing color can be fully edited there, the same
// as building one at create time. Never touches physical GarmentUnits — a
// size removed here just stops being offered, existing units are untouched;
// removing the color itself is a separate, guarded action (see
// deleteVariant) that this never triggers.
export async function updateVariant(productId: string, variantId: string, input: ProductVariantInput): Promise<VariantResult> {
  const token = await getToken();
  if (!token) return { ok: false, message: "Your session has expired. Sign in again." };
  try {
    const raw = await apiFetch<{ id: string; color: string; colorHex: string; imageUrls: Record<string, string>; isActive: boolean; sizes: { size: string }[] }>(
      `/console/products/${productId}/variants/${variantId}`,
      { method: "PATCH", token, body: toBackendVariant(input) }
    );
    revalidatePath(`/products/${productId}`);
    return {
      ok: true,
      variant: {
        id: raw.id,
        color: raw.color,
        colorHex: raw.colorHex,
        imageUrls: raw.imageUrls,
        isActive: raw.isActive,
        sizes: raw.sizes.map((s) => s.size),
        unitCount: 0,
      },
    };
  } catch (error) {
    return { ok: false, message: describeApiError(error) };
  }
}

// Mirrors PATCH /console/products/:id/variants/:variantId — replaces which
// sizes this color is offered in. Never touches physical GarmentUnits; a
// size removed here just stops being offered, existing units are untouched.
export async function updateVariantSizes(productId: string, variantId: string, sizes: string[]): Promise<SimpleResult> {
  const token = await getToken();
  if (!token) return { ok: false, message: "Your session has expired. Sign in again." };
  try {
    await apiFetch(`/console/products/${productId}/variants/${variantId}`, { method: "PATCH", token, body: { sizes } });
  } catch (error) {
    return { ok: false, message: describeApiError(error) };
  }
  revalidatePath(`/products/${productId}`);
  return { ok: true };
}

// Mirrors PATCH /console/products/:id/variants/:variantId — replaces this
// color's imageUrls map wholesale (the backend stores it as one JSON column,
// so a partial PATCH here still needs the full map, not just the changed
// view). `views` is sent alongside as Object.keys(imageUrls) so the two
// stay in sync — see productViewInput in the backend's schemas.ts.
export async function updateVariantImages(
  productId: string,
  variantId: string,
  imageUrls: Record<string, string>
): Promise<VariantResult> {
  const token = await getToken();
  if (!token) return { ok: false, message: "Your session has expired. Sign in again." };
  try {
    const raw = await apiFetch<{ id: string; color: string; colorHex: string; imageUrls: Record<string, string>; isActive: boolean; sizes: { size: string }[] }>(
      `/console/products/${productId}/variants/${variantId}`,
      { method: "PATCH", token, body: { imageUrls, views: Object.keys(imageUrls) } }
    );
    revalidatePath(`/products/${productId}`);
    return {
      ok: true,
      variant: {
        id: raw.id,
        color: raw.color,
        colorHex: raw.colorHex,
        imageUrls: raw.imageUrls,
        isActive: raw.isActive,
        sizes: raw.sizes.map((s) => s.size),
        unitCount: 0,
      },
    };
  } catch (error) {
    return { ok: false, message: describeApiError(error) };
  }
}

// Mirrors DELETE /console/products/:id/variants/:variantId — refused (409)
// if the color still has any non-retired/sold physical units.
export async function deleteVariant(productId: string, variantId: string): Promise<SimpleResult> {
  const token = await getToken();
  if (!token) return { ok: false, message: "Your session has expired. Sign in again." };
  try {
    await apiFetch(`/console/products/${productId}/variants/${variantId}`, { method: "DELETE", token });
  } catch (error) {
    return { ok: false, message: describeApiError(error) };
  }
  revalidatePath(`/products/${productId}`);
  return { ok: true };
}

// Mirrors POST /console/products/:id/units — adds one physical garment unit
// under a specific color + size.
export async function addProductUnit(input: {
  productId: string;
  variantId: string;
  sku: string;
  size: string;
  facilityId?: string;
}): Promise<SimpleResult> {
  const token = await getToken();
  if (!token) return { ok: false, message: "Your session has expired. Sign in again." };
  try {
    await apiFetch(`/console/products/${input.productId}/units`, {
      method: "POST",
      token,
      body: { variantId: input.variantId, sku: input.sku, size: input.size, facilityId: input.facilityId },
    });
  } catch (error) {
    return { ok: false, message: describeApiError(error) };
  }
  revalidatePath(`/products/${input.productId}`);
  revalidatePath("/inventory");
  return { ok: true };
}
