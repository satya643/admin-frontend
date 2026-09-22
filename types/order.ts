import type { GarmentUnitListItem } from "./garment-unit";

export type OrderStatus =
  | "pending_payment"
  | "confirmed"
  | "packed"
  | "shipped"
  | "with_customer"
  | "return_in_transit"
  | "closed"
  | "cancelled";

export type CartMode = "rent" | "buy";

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  product: { id: string; name: string };
  garmentUnitId: string | null;
  garmentUnit: GarmentUnitListItem | null;
  mode: CartMode;
  size: string;
  unitPricePaise: number;
  depositPaise: number;
  rentDays: number | null;
  rentStartDate: string | null;
  rentReturnDate: string | null;
  actualReturnDate: string | null;
}

export interface OrderListItem {
  id: string;
  status: OrderStatus;
  statusLabel: string;
  customer: { id: string; name: string; email: string } | undefined;
  placedAt: string;
  eventDate: string | null;
  city: string | null;
  totalPaise: number;
  depositTotalPaise: number;
  currency: string;
}

export interface OrderDetail extends OrderListItem {
  items: OrderItem[];
}
