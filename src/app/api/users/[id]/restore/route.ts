import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  await prisma.user.update({
    where: { id },
    data: { deletedAt: null },
  });

  return NextResponse.json({ ok: true });
}
