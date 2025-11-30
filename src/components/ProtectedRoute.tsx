"use client";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useMe } from "@/hooks/useAuth";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const redirectedRef = useRef(false);
  const [isClient, setIsClient] = useState(false);

  // Check if user is authenticated via server
  const { data: user, isLoading, error } = useMe();

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient || isLoading) return;

    // If no user and we're done loading, redirect to login
    if (!user && !isLoading && !redirectedRef.current) {
      redirectedRef.current = true;
      router.replace("/login");
    }
  }, [user, isLoading, router, isClient]);

  // Show loading state while checking authentication
  if (!isClient || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg">Verifying access...</p>
      </div>
    );
  }

  // If there's an error or no user, don't render children
  if (error || !user) {
    return null;
  }

  // User is authenticated, render children
  return <>{children}</>;
}
