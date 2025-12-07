"use client";

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import Link from "next/link";
import { sidebarItems } from "./SidebarItems";
import { useMe } from "@/hooks/useAuth";

export default function MobileSidebar() {
  const { data: user } = useMe();
  return (
    <Sheet>
      <SheetTrigger className="md:hidden">
        <Menu className="h-6 w-6" />
      </SheetTrigger>

      <SheetContent side="left" className="p-0 w-64">
        <nav className="mt-6 px-4">
          {sidebarItems
            .filter((item) => item.roles.includes(user?.role))
            .map((item) => (
              <Link
                href={item.href}
                key={item.href}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800"
              >
                <item.icon className="h-5 w-5" />
                <span>{item.name}</span>
              </Link>
            ))}
        </nav>
      </SheetContent>
    </Sheet>
  );
}
