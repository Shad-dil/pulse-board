import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const body = await req.json();

  const settings = await prisma.userSettings.upsert({
    where: { userId: id },
    create: { userId: id, ...body },
    update: { ...body },
  });

  return NextResponse.json({ settings });
}
