import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { error } from "console";
import { maxTime } from "date-fns/constants";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);

  const limit = Number(url.searchParams.get("limit") || 10);
  const cursor = url.searchParams.get("cursor") || null;

  const search = url.searchParams.get("search") || undefined;
  const role = url.searchParams.get("role") || undefined;

  const sortBy = url.searchParams.get("sortBy") || "createdAt";
  const order = url.searchParams.get("order") === "asc" ? "asc" : "desc";

  const where: any = { deletedAt: null };

  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { email: { contains: search, mode: "insensitive" } },
    ];
  }

  if (role && role !== "ALL") where.role = role;

  const users = await prisma.user.findMany({
    where,
    take: limit + 1, // fetch one extra to detect next cursor
    cursor: cursor ? { id: cursor } : undefined,
    orderBy: { [sortBy]: order },
  });

  let nextCursor = null;

  if (users.length > limit) {
    const nextUser = users.pop();
    nextCursor = nextUser?.id ?? null;
  }

  return NextResponse.json({
    users,
    nextCursor,
  });
}

async function retry<T>(
  task: () => Promise<T>,
  maxTry = 3,
  delay = 2000
): Promise<T> {
  for (let i = 0; i < maxTry; i++) {
    try {
      return await task();
    } catch (err) {
      if (i === maxTry - 1) throw err;

      await new Promise((res) =>
        setTimeout(() => res(null), delay * Math.pow(2, i))
      );
    }
  }
  throw new Error("Max retries exceeded");
}
export async function POST(req: Request) {
  const { name, email, password, role } = await req.json();
  try {
    const exist = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });
    if (exist) {
      return NextResponse.json(
        {
          error: "This Email is already added",
        },
        {
          status: 409,
        }
      );
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await retry(() =>
      prisma.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          role,
        },
      })
    );
    return NextResponse.json({
      newUser: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Not Able to Add User " },
      { status: 500 }
    );
  }
}
