"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUser } from "@/hooks/useUser";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { toast } from "react-toastify";
import { useAddUser, useRegister } from "@/hooks/useAuth";

type Props = {
  userId: string | null;
  open: boolean;
  onClose: () => void;
};
const Roles = ["ADMIN", "USER", "MODERATOR"] as const;
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
const registerSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Minimum 2 charecter " })
    .max(20, { message: "Maximum 20 charecter" }),
  email: z.string().email({ message: "Email is required" }),
  password: userPasswordSchema,
  role: z
    .union([
      z.enum(Roles, {
        required_error: "Please Select one", // This error won't trigger for ""
      }),
      z.literal(""), // Explicitly allow the empty string
    ])
    .pipe(
      // Use a refinement if you still want the final value to be required/validated
      z.string().min(1, { message: "Please select a role." })
    ),
});

export default function AddUseModel({ userId, open, onClose }: Props) {
  const { data: user, isLoading } = useUser(userId || undefined);
  const {
    register,
    handleSubmit: registerNow,
    formState,
  } = useForm({
    resolver: zodResolver(registerSchema),
  });

  const { errors } = formState;

  const addUser = useAddUser();

  const [error, setServerError] = useState("");

  async function handleSubmit(data: {
    name: string;
    email: string;
    password: string;
    role: string;
  }) {
    setServerError("");

    try {
      await addUser.mutateAsync(data);
      onClose();
      toast.success("User is Added");
    } catch (err: any) {
      setServerError(err.response?.data?.error || "Adding is failed");
      toast.error("Something Went Wrong");
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent
        className="
      fixed 
      left-1/2 top-1/2 
      -translate-x-1/2 -translate-y-1/2
      w-[95vw] max-w-lg md:max-w-2xl lg:max-w-3xl
      max-h-[90vh]
      overflow-hidden 
      rounded-xl
      z-9999
    "
      >
        <div
          className="
      flex 
      flex-col
      max-h-[90vh] 
      md:max-h-[80vh]
    "
        >
          {/* HEADER */}
          <DialogHeader className="p-6 pb-3">
            <DialogTitle>Add User</DialogTitle>
            <DialogDescription>Add Users and its Role</DialogDescription>
          </DialogHeader>

          {/* TABS WRAPPER (scrolls independently) */}
          <div className="flex-1 overflow-y-auto px-6 pb-6">
            <div className=" flex items-center justify-center px-4">
              <form
                onSubmit={registerNow(handleSubmit)}
                className="w-full max-w-md p-6 border rounded-lg dark:bg-neutral-900 space-y-4"
              >
                <h2 className="text-2xl font-semibold">Create Account</h2>

                {error && <p className="text-red-500 text-sm">{error}</p>}

                <Input
                  placeholder="Full Name"
                  type="text"
                  {...register("name")}
                />
                {errors.name && (
                  <span className="text-sm text-red-300">
                    {errors.name?.message}
                  </span>
                )}
                <Input
                  placeholder="Email Address"
                  type="email"
                  {...register("email")}
                />
                {errors.email && (
                  <span className="text-sm text-red-300">
                    {errors.email?.message}
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
                <select
                  className="border p-2 rounded dark:bg-neutral-900 w-full md:w-full"
                  {...register("role")}
                >
                  <option value="">Select a Role</option>
                  <option value="ADMIN">Admin</option>
                  <option value="USER">User</option>
                  <option value="MODERATOR">Moderator</option>
                </select>
                {errors.role && (
                  <span className="text-sm text-red-300">
                    {errors.role?.message}
                  </span>
                )}

                <Button
                  type="submit"
                  className="w-full"
                  disabled={addUser.isPending}
                >
                  {addUser.isPending ? "Adding..." : "Add"}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
