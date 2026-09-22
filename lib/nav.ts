import {
  LayoutDashboard,
  Shirt,
  Boxes,
  ClipboardList,
  Truck,
  WashingMachine,
  CreditCard,
  Users,
  BarChart3,
  Bell,
  Settings,
  Image,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

export const NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Products", href: "/products", icon: Shirt },
  { label: "Shop by Occasion", href: "/occasions", icon: Image },
  { label: "Inventory", href: "/inventory", icon: Boxes },
  { label: "Orders", href: "/orders", icon: ClipboardList },
  { label: "Delivery", href: "/delivery", icon: Truck },
  { label: "Laundry", href: "/laundry", icon: WashingMachine },
  { label: "Payments", href: "/payments", icon: CreditCard },
  { label: "Customers", href: "/customers", icon: Users },
  { label: "Analytics", href: "/analytics", icon: BarChart3 },
  { label: "Notifications", href: "/notifications", icon: Bell },
  { label: "Settings", href: "/settings", icon: Settings },
];
