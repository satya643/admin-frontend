// One color a product comes in. Product = the design ("Premium Linen
// Shirt"); ProductVariant = one color of it ("Black"); a physical
// GarmentUnit is one item of a (variant, size) — see the inventory types.
export interface ProductVariant {
  id: string;
  color: string;
  colorHex: string;
  // Keyed by photo angle ("front", "back", ...) — see lib/meta/views.ts —
  // one URL per view, same shape the backend stores it in.
  imageUrls: Record<string, string>;
  isActive: boolean;
  sizes: string[];
  unitCount: number;
}

export interface Measurement {
  label: string;
  value: string;
}

export interface Product {
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
  measurements: Record<string, string | number>;
  // Free-text product write-up shown on the shop's PDP.
  description: string;
  // One admin-uploaded thumbnail shown on cards/cart lines before any color
  // is picked, or when a color has no photo of its own yet.
  coverImageUrl: string | null;
  // Per-product condition/quality blurb (used to be one hardcoded string
  // for every product).
  conditionCopy: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  variants: ProductVariant[];
  unitCount: number;
  // Convenience flattening of the first variant, for the products list/
  // table swatch — anywhere colors matter individually, use `variants`.
  color: string;
  colorHex: string;
}

// A color to create along with the product ("+ Add Another Color" in the
// create form, built into one array before a single submit).
export interface ProductVariantInput {
  color: string;
  colorHex: string;
  sizes: string[];
  isActive: boolean;
  // Keyed by view ("front", "back", ...) — see lib/meta/views.ts. Optional
  // since the create form lets a color be added with no images yet.
  imageUrls?: Record<string, string>;
}

// Scalar product fields only — used for both create and PATCH. Colors are
// never part of an update; they're managed one at a time via
// createVariant/updateVariant/deleteVariant (see lib/actions/products.ts)
// so an edit here can never accidentally touch a color's real inventory.
export interface ProductFormInput {
  name: string;
  brand: string;
  categoryId: string;
  occasions: string[];
  styles: string[];
  rentPricePaise: number;
  rentDays: number;
  buyPricePaise: number;
  depositPaise: number;
  deliveryDays: number;
  fabric: string;
  care: string[];
  isActive: boolean;
  description: string;
  coverImageUrl?: string;
  conditionCopy: string;
  measurements: Measurement[];
}

export interface CreateProductInput extends ProductFormInput {
  variants: ProductVariantInput[];
}
