import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const body = await req.json();

  const settings = await prisma.userSettings.upsert({
    where: { userId: id },
    create: { userId: id, ...body },
    update: { ...body },
  });

  return NextResponse.json({ settings });
}
