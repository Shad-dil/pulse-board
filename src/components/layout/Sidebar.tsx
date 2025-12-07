"use client";

import Link from "next/link";
import { sidebarItems } from "./SidebarItems";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { MoveLeftIcon, MoveRightIcon } from "lucide-react";
import { useMe } from "@/hooks/useAuth";

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const { data: user } = useMe();

  useEffect(() => {
    setIsClient(true);
    const savedState = localStorage.getItem("sidebarCollapsed") === "true";
    setCollapsed(savedState);
  }, []);

  const toggleCollapsed = () => {
    const newState = !collapsed;
    setCollapsed(newState);
    localStorage.setItem("sidebarCollapsed", String(newState));
  };

  if (!isClient) return null;

  return (
    <aside
      className={cn(
        "h-screen border-r bg-white dark:bg-black transition-all duration-300 hidden md:flex flex-col",
        collapsed ? "w-20" : "w-64"
      )}
    >
      {/* Logo Area */}
      <div className="flex items-center justify-between px-4 py-4">
        <h1 className={cn("text-xl font-bold", collapsed && "hidden")}>
          DASHBOARD
        </h1>

        {/* <button
          className="p-2 rounded hover:bg-neutral-100 dark:hover:bg-neutral-800"
          onClick={toggleCollapsed}
        >
          {collapsed ? (
            <MoveRightIcon className="h-6 w-6" />
          ) : (
            <MoveLeftIcon className="h-6 w-6" />
          )}
        </button> */}
      </div>

      {/* Menu Items */}
      <nav className="mt-4 space-y-2 px-3">
        {sidebarItems
          .filter((item) => item.roles.includes(user?.role))
          .map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800",
                collapsed && "justify-center"
              )}
            >
              <item.icon className="h-5 w-5" />
              {!collapsed && <span>{item.name}</span>}
            </Link>
          ))}
      </nav>
    </aside>
  );
}
