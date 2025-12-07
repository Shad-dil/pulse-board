import { prisma } from "./prisma";

export async function logActivity({
  userId,
  message,
}: {
  userId: any;
  message: string;
}) {
  try {
    await prisma.activity.create({
      data: {
        userId,
        message,
      },
    });
  } catch (error) {
    console.error("Activity log failed:", error);
  }
}
