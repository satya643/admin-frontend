export type CustomerTier = "signature" | "member" | "new";

export interface Customer {
  id: string;
  name: string;
  email: string;
  totalRentals: number;
  onTimeRate: number;
  tier: CustomerTier;
}
