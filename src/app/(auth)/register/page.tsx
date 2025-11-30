"use client";

import { useRegister, useMe } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function RegisterPage() {
  const register = useRegister();
  const router = useRouter();
  const [error, setError] = useState("");
  const { data: user, isLoading } = useMe();

  useEffect(() => {
    // If user is already logged in, redirect to dashboard
    if (user && !isLoading) {
      router.replace("/dashboard");
    }
  }, [user, isLoading, router]);

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <p>Checking authentication...</p>
      </div>
    );
  }

  // Don't show register form if user is authenticated
  if (user) {
    return null;
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    const form = new FormData(e.currentTarget);
    const name = form.get("name") as string;
    const email = form.get("email") as string;
    const password = form.get("password") as string;

    try {
      await register.mutateAsync({ name, email, password });
      router.replace("/dashboard");
    } catch (err: any) {
      setError(err.response?.data?.error || "Registration failed");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md p-6 border rounded-lg dark:bg-neutral-900 space-y-4"
      >
        <h2 className="text-2xl font-semibold">Create Account</h2>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <Input name="name" placeholder="Full Name" required />

        <Input name="email" placeholder="Email Address" type="email" required />

        <Input
          name="password"
          placeholder="Password"
          type="password"
          required
        />

        <Button type="submit" className="w-full" disabled={register.isPending}>
          {register.isPending ? "Creating..." : "Register"}
        </Button>

        <p className="text-center text-sm text-gray-500">
          Already have an account?{" "}
          <a href="/auth/login" className="text-blue-600">
            Login
          </a>
        </p>
      </form>
    </div>
  );
}
