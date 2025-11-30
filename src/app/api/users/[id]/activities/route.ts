import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const take = Number(new URL(req.url).searchParams.get("take") || 10);

  const activities = await prisma.activity.findMany({
    where: { userId: id },
    orderBy: { createdAt: "desc" },
    take,
  });

  return NextResponse.json({ activities });
}
