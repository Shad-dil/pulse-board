// src/app/api/settings/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyJwt } from "@/lib/jwt";
import { cookies } from "next/headers";

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) return NextResponse.json({ user: null }, { status: 401 });

  const decoded: any = verifyJwt(token);
  if (!decoded) return NextResponse.json({ user: null }, { status: 401 });

  const user = await prisma.user.findUnique({
    where: { id: decoded.id },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
      lastLogin: true,
      settings: true,
    },
  });

  return NextResponse.json({ user });
}

export async function PATCH(req: Request) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const decoded: any = verifyJwt(token);
  if (!decoded)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { name, email, settings } = body;

  // update user profile (name, email) - email must stay unique
  const user = await prisma.user.update({
    where: { id: decoded.id },
    data: {
      ...(name ? { name } : {}),
      ...(email ? { email } : {}),
    },
    select: { id: true, name: true, email: true },
  });

  // upsert settings
  if (settings) {
    await prisma.userSettings.upsert({
      where: { userId: decoded.id },
      create: { userId: decoded.id, ...settings },
      update: { ...settings },
    });
  }

  return NextResponse.json({ user });
}
