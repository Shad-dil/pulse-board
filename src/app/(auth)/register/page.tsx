"use client";

import { useRegister, useMe } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const userPasswordSchema = z
  .string()
  .min(6, { message: "Password must be at least 6 characters long" })
  // Optional: Add a simple complexity check using a regex refine
  .refine((password) => /[A-Z]/.test(password), {
    message: "Password requires at least one uppercase letter",
  })
  .refine((password) => /[0-9]/.test(password), {
    message: "Password requires at least one number",
  });
const registerSchema = z
  .object({
    name: z
      .string()
      .min(2, { message: "minimum 2 charecter " })
      .max(20, { message: "maximum 20 charecter" }),
    email: z.string().email({ message: "email is required" }),
    password: userPasswordSchema,
    confirmPassword: z
      .string()
      .min(6, { message: "Password must be at least 6 characters long" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "confirm Password didnt match with password",
    path: ["confirmPassword"],
  });

export type RegisterFormInputs = z.infer<typeof registerSchema>;
export default function RegisterPage() {
  const [productTitle, setProductTitle] = useState("Loading...");
  const {
    register,
    handleSubmit: registerNow,
    formState,
  } = useForm({
    resolver: zodResolver(registerSchema),
  });

  const { errors } = formState;
  useEffect(() => {
    // Simulate fetching dynamic data after component mounts
    setTimeout(() => {
      const fetchedTitle = "PulseBoard || Register";
      setProductTitle(fetchedTitle);

      // Update the page title using the browser API
      document.title = fetchedTitle;
    }, 1000);
  }, []);
  const registers = useRegister();
  const router = useRouter();
  const [error, setServerError] = useState("");
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

  async function handleSubmit(data: {
    name: string;
    email: string;
    password: string;
  }) {
    setServerError("");

    // const form = new FormData(e.currentTarget);
    // const name = form.get("name") as string;
    // const email = form.get("email") as string;
    // const password = form.get("password") as string;

    try {
      await registers.mutateAsync(data);
      router.replace("/dashboard");
    } catch (err: any) {
      setServerError(err.response?.data?.error || "Registration failed");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <form
        onSubmit={registerNow(handleSubmit)}
        className="w-full max-w-md p-6 border rounded-lg dark:bg-neutral-900 space-y-4"
      >
        <h2 className="text-2xl font-semibold">Create Account</h2>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <Input placeholder="Full Name" type="text" {...register("name")} />
        {errors.name && (
          <span className="text-sm text-red-300">{errors.name?.message}</span>
        )}
        <Input
          placeholder="Email Address"
          type="email"
          {...register("email")}
        />
        {errors.email && (
          <span className="text-sm text-red-300">{errors.email?.message}</span>
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
        <Input
          placeholder="Confirm Password"
          type="password"
          {...register("confirmPassword")}
        />
        {errors.confirmPassword && (
          <span className="text-sm text-red-300">
            {errors.confirmPassword?.message}
          </span>
        )}

        <Button type="submit" className="w-full" disabled={registers.isPending}>
          {registers.isPending ? "Creating..." : "Register"}
        </Button>

        <p className="text-center text-sm text-gray-500">
          Already have an account?{" "}
          <a href="/login" className="text-blue-600">
            Login
          </a>
        </p>
      </form>
    </div>
  );
}
