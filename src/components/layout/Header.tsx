"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import MobileSidebar from "./MobileSidebar";
import { Button } from "../ui/button";
import { useState, useEffect } from "react";
import { useLogout, useMe } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import Image from "next/image";

export default function Header() {
  const router = useRouter();
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const { mutateAsync: logout, isPending: isLoading } = useLogout();
  const { data: user } = useMe();

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    const htmlElement = document.documentElement;
    if (newTheme === "dark") {
      htmlElement.classList.add("dark");
    } else {
      htmlElement.classList.remove("dark");
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      router.replace("/login");
    } catch (error: unknown) {
      console.error("Logout failed:", error);
    }
  };

  const avatar = user ? user?.email?.slice(0, 2).toUpperCase() : "";

  return (
    <header className="h-16 border-b bg-white dark:bg-black flex items-center px-4 justify-between">
      {/* Mobile Menu */}
      <MobileSidebar />

      <div className="font-semibold text-lg">
        <Image
          className="dark:invert"
          src="/sitelogo.png"
          alt="Next.js logo"
          width={130}
          height={30}
          priority
        />
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={toggleTheme}
          className="p-2 rounded hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer"
          title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
        >
          {theme === "light" ? "🌙" : "☀️"}
        </button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Avatar className="bg-gray-300 cursor-pointer hover:bg-gray-400 transition dark:bg-gray-600">
              <p className="text-center ml-1 mt-1">{user && avatar}</p>
            </Avatar>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-40 mr-2">
            <DropdownMenuItem
              disabled
              className="font-semibold cursor-default opacity-60"
            >
              {user?.email}
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() => router.push("/dashboard/profile")}
              className="cursor-pointer"
            >
              Profile
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() => router.push("/dashboard/settings")}
              className="cursor-pointer"
            >
              Settings
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={handleLogout}
              disabled={isLoading}
              className="text-red-500 font-medium cursor-pointer"
            >
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
