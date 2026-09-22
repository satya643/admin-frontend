export type DeliveryType = "pickup" | "dropoff";
export type DeliveryStatus = "scheduled" | "en_route" | "completed" | "delayed";

export interface Courier {
  id: string;
  name: string;
  zones: string[];
}

export interface DeliveryJob {
  id: string;
  type: DeliveryType;
  orderId: string;
  customer: string;
  window: string;
  windowStart: string;
  windowEnd: string;
  zone: string;
  courier: { id: string; name: string } | null;
  status: DeliveryStatus;
}
