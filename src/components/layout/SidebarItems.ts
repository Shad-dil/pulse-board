import { Home, Users, Settings, BarChart } from "lucide-react";

export const sidebarItems = [
  {
    name: "Overview",
    href: "/dashboard",
    icon: Home,
    roles: ["USER", "ADMIN", "MODERATOR"],
  },
  {
    name: "Analytics",
    href: "/dashboard/analytics",
    icon: BarChart,
    roles: ["ADMIN"],
  },
  {
    name: "Users",
    href: "/dashboard/users",
    icon: Users,
    roles: ["USER", "ADMIN", "MODERATOR"],
  },
  {
    name: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
    roles: ["USER", "ADMIN", "MODERATOR"],
  },
];
