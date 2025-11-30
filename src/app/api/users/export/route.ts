import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

function toCSV(rows: any[]) {
  const cols = ["name", "email", "role", "createdAt"];
  const header = cols.join(",") + "\n";
  const body = rows
    .map((r) =>
      [r.name, r.email, r.role, new Date(r.createdAt).toISOString()].join(",")
    )
    .join("\n");
  return header + body;
}

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const page = url.searchParams.get("page") || undefined;
  const limit = url.searchParams.get("limit") || undefined;
  const search = url.searchParams.get("search") || undefined;
  const role = url.searchParams.get("role") || undefined;
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
    orderBy: { createdAt: "desc" },
    take: limit ? Number(limit) : undefined,
    skip: page && limit ? (Number(page) - 1) * Number(limit) : undefined,
    select: { name: true, email: true, role: true, createdAt: true },
  });

  const csv = toCSV(users);

  return new Response(csv, {
    status: 200,
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": `attachment; filename="users_export.csv"`,
    },
  });
}
