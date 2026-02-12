import {
  LayoutDashboard,
  ShoppingBag,
  Users,
  Settings,
  FileText,
  HelpCircle,
  CheckSquare,
  Search,
  ClipboardList,
  Building2,
  Landmark,
} from "lucide-react";

export interface MenuItem {
  title: string;
  href: string;
  icon?: any;
}

export type Role =
  | "SUPER_ADMIN"
  | "ADMIN"
  | "FRONT_OFFICER"
  | "SUPERVISOR"
  | "CITIZEN";

export const MENU_ITEMS: Record<Role, MenuItem[]> = {
  SUPER_ADMIN: [
    { title: "Dashboard", href: "/admin", icon: LayoutDashboard },
    {
      title: "Bureau (Sector) Registry",
      href: "/admin/sectors",
      icon: Landmark,
    },
    { title: "Service Registry", href: "/admin/services", icon: Building2 },
    { title: "Form Builder", href: "/admin/form-builder", icon: FileText },
    { title: "User Management", href: "/admin/users", icon: Users },
    { title: "Settings", href: "/admin/settings", icon: Settings },
  ],

  ADMIN: [
    { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { title: "Services", href: "#", icon: ShoppingBag },
    { title: "Users & Roles", href: "#", icon: Users },
    { title: "Configuration", href: "#", icon: Settings },
    { title: "Audit", href: "#", icon: FileText },
    { title: "Reports", href: "#", icon: ClipboardList },
  ],
  FRONT_OFFICER: [
    { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { title: "My Tasks", href: "#", icon: CheckSquare },
    { title: "Cases", href: "#", icon: FileText },
  ],
  SUPERVISOR: [
    { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { title: "Approvals", href: "#", icon: CheckSquare },
    { title: "Cases", href: "#", icon: FileText },
    { title: "Reports", href: "#", icon: ClipboardList },
  ],
  CITIZEN: [
    { title: "My Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { title: "My Requests", href: "#", icon: FileText },
    { title: "Pending Actions", href: "#", icon: CheckSquare },
    {
      title: "Notifications",
      href: "#",
      icon: FileText,
    },
    { title: "Documents", href: "#", icon: FileText },
    { title: "Payments", href: "#", icon: ShoppingBag },
  ],
};
