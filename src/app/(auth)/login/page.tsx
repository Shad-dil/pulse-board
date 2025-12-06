"use client";

import { useLogin, useMe } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useForm } from "react-hook-form";
const loginSchema = z.object({
  email: z.string().email(),
  password: z
    .string()
    .min(4, { message: "Password must be atleast 4 charecter" }),
});
export default function LoginPage() {
  const [productTitle, setProductTitle] = useState("Loading...");
  const {
    register,
    handleSubmit: loginFormSubmit,
    formState,
  } = useForm({
    resolver: zodResolver(loginSchema),
  });
  const { errors, isLoading: isFormLoading } = formState;

  useEffect(() => {
    // Simulate fetching dynamic data after component mounts
    setTimeout(() => {
      const fetchedTitle = "PulseBoard || Login";
      setProductTitle(fetchedTitle);

      // Update the page title using the browser API
      document.title = fetchedTitle;
    }, 1000);
  }, []);
  const login = useLogin();
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

  // Don't show login form if user is authenticated
  if (user) {
    return null;
  }

  async function handleSubmit(data: { email: string; password: string }) {
    // e.preventDefault();
    // setError("");

    // const form = new FormData(e.currentTarget);
    // const email = form.get("email") as string;
    // const password = form.get("password") as string;

    try {
      await login.mutateAsync(data);
      router.replace("/dashboard");
    } catch (err: any) {
      setError(err.response?.data?.error || "Invalid email or password");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <form
        onSubmit={loginFormSubmit(handleSubmit)}
        className="w-full max-w-md p-6 border rounded-lg dark:bg-neutral-900 space-y-4"
      >
        <h2 className="text-2xl font-semibold">Login</h2>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <Input
          placeholder="Email Address"
          type="email"
          {...register("email")}
        />
        {errors.email && (
          <span className="text-sm text-red-300">
            {errors.email?.message || "email is required"}{" "}
          </span>
        )}
        <Input
          placeholder="Password"
          type="password"
          {...register("password")}
        />
        {errors.password && (
          <span className="text-sm text-red-300">
            {errors.password?.message}
          </span>
        )}
        <Button type="submit" className="w-full" disabled={login.isPending}>
          {login.isPending ? "Signing in..." : "Login"}
        </Button>

        <p className="text-center text-sm text-gray-500">
          Don’t have an account?{" "}
          <a href="/register" className="text-blue-600">
            Create Account
          </a>
        </p>
      </form>
    </div>
  );
}
