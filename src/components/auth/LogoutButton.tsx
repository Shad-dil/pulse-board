"use client";
import { useLogout } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();
  const { mutateAsync: logout, isPending } = useLogout();

  const handleLogout = async () => {
    try {
      await logout();
      router.replace("/login");
    } catch (error: unknown) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <button
      onClick={handleLogout}
      disabled={isPending}
      className="p-2 bg-red-500 hover:bg-red-600 disabled:bg-red-400 text-white rounded transition"
    >
      {isPending ? "Logging out..." : "Logout"}
    </button>
  );
}
