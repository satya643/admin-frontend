import type { Paginated } from "@/types/common";
import type { GarmentStage, GarmentUnitDetail, GarmentUnitListItem, LifecycleCounts } from "@/types/garment-unit";
import { ALLOWED_TRANSITIONS } from "@/lib/meta/stage-transitions";
import { apiFetch } from "@/lib/api/client";
import { ApiError } from "@/lib/api/errors";
import { getToken } from "@/lib/auth/session";

export interface ListUnitsParams {
  page?: number;
  pageSize?: number;
  stage?: GarmentStage | "all";
  q?: string;
}

// The real endpoint returns a flat row (id, sku, productId, variantId, name,
// brand, category, color, ...) rather than the nested `product: {id, name,
// brand}` shape this app's GarmentUnitListItem type uses — adapt at this one
// boundary rather than threading the backend's flat shape through the app.
interface ApiGarmentUnit {
  id: string;
  sku: string;
  productId: string;
  variantId: string;
  name: string;
  brand: string;
  color: string;
  size: string;
  stage: GarmentStage;
  condition: GarmentUnitListItem["condition"];
  lastMovedAt: string;
  timesRented: number;
  currentOrderId: string | null;
  facilityId: string | null;
}

function adaptGarmentUnit(api: ApiGarmentUnit): GarmentUnitListItem {
  return {
    id: api.id,
    sku: api.sku,
    variantId: api.variantId,
    product: { id: api.productId, name: api.name, brand: api.brand },
    color: api.color,
    size: api.size,
    stage: api.stage,
    condition: api.condition,
    lastMovedAt: api.lastMovedAt,
    timesRented: api.timesRented,
    currentOrderId: api.currentOrderId,
    facilityId: api.facilityId,
  };
}

// Mirrors GET /console/garment-units.
export async function listGarmentUnits(params: ListUnitsParams = {}): Promise<Paginated<GarmentUnitListItem>> {
  const { page = 1, pageSize = 10, stage, q } = params;
  const token = await getToken();
  const data = await apiFetch<Paginated<ApiGarmentUnit>>("/console/garment-units", {
    token: token ?? undefined,
    searchParams: { page, pageSize, stage: stage && stage !== "all" ? stage : undefined, q },
  });
  return { ...data, items: data.items.map(adaptGarmentUnit) };
}

interface ApiGarmentUnitDetail extends ApiGarmentUnit {
  currentOrder: { id: string; status: string; customer: { name: string } } | null;
  stageTransitions: GarmentUnitDetail["stageTransitions"];
}

// Mirrors GET /console/garment-units/:id — also flattened, same shape as
// the list endpoint plus currentOrder/stageTransitions.
export async function getGarmentUnit(id: string): Promise<GarmentUnitDetail | null> {
  const token = await getToken();
  try {
    const data = await apiFetch<ApiGarmentUnitDetail>(`/console/garment-units/${id}`, { token: token ?? undefined });
    return { ...adaptGarmentUnit(data), currentOrder: data.currentOrder, stageTransitions: data.stageTransitions };
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) return null;
    throw error;
  }
}

// Mirrors GET /console/lifecycle/counts.
export async function getLifecycleCounts(): Promise<LifecycleCounts> {
  const token = await getToken();
  return apiFetch<LifecycleCounts>("/console/lifecycle/counts", { token: token ?? undefined });
}

export function allowedNextStages(current: GarmentStage): GarmentStage[] {
  return ALLOWED_TRANSITIONS[current];
}
