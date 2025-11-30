import { prisma } from "@/lib/prisma";
import { signJwt } from "@/lib/jwt";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";

// Retry helper for database operations
async function withRetry<T>(
  fn: () => Promise<T>,
  maxRetries = 3,
  delay = 1000
): Promise<T> {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error: any) {
      if (i === maxRetries - 1) throw error;
      // Exponential backoff
      await new Promise((resolve) =>
        setTimeout(resolve, delay * Math.pow(2, i))
      );
    }
  }
  throw new Error("Max retries exceeded");
}

export async function POST(req: Request) {
  const { name, email, password } = await req.json();

  try {
    // 1. Check if user exists (with retry)
    const exist = await withRetry(() =>
      prisma.user.findUnique({ where: { email } })
    );
    if (exist) {
      return NextResponse.json(
        { error: "Email already exists" },
        { status: 409 }
      );
    }

    // 2. Hash password
    const hashed = await bcrypt.hash(password, 10);

    // 3. Create user (with retry)
    const user = await withRetry(() =>
      prisma.user.create({
        data: { name, email, password: hashed },
      })
    );

    // 4. Generate JWT
    const token = signJwt({ id: user.id, email: user.email });

    // 5. Set cookie
    const cookieStore = await cookies();
    cookieStore.set("token", token, {
      httpOnly: true,
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    // Return user to frontend
    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error: any) {
    console.error("Registration error:", error);
    return NextResponse.json(
      {
        error: error.message || "Registration failed. Please try again later.",
      },
      { status: 500 }
    );
  }
}
