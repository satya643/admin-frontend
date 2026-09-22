export type Role = "customer" | "operator" | "admin";

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  role: Role;
  verified: boolean;
  country: string | null;
  preferredCurrency: string | null;
}
