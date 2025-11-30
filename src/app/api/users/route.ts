import { prisma } from "@/lib/prisma";
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
