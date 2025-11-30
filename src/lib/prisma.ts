import { PrismaClient } from "@prisma/client";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ["query"],
    errorFormat: "pretty",
  });

// Add connection timeout
prisma.$connect().catch((err) => {
  console.error("Failed to connect to database:", err);
  process.exit(1);
});

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
