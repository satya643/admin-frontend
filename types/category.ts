export interface Category {
  id: string;
  name: string;
  slug: string;
  isActive: boolean;
  sortOrder: number;
  productCount?: number;
}

export interface CategoryFormInput {
  name: string;
  isActive: boolean;
}
