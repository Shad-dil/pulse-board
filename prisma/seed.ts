import { PrismaClient, Prisma, Role } from "@prisma/client";
import { faker } from "@faker-js/faker";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

// Helper: random date within last X days
function randomDate(days: number) {
  const d = new Date();
  d.setDate(d.getDate() - Math.floor(Math.random() * days));
  return d;
}

async function main() {
  console.log("🌱 Starting database seed...");

  // Clear old data
  await prisma.activity.deleteMany();
  await prisma.userSettings.deleteMany();
  await prisma.funnel.deleteMany();
  await prisma.traffic.deleteMany();
  await prisma.analyticsStats.deleteMany();
  await prisma.user.deleteMany();

  console.log("✔ Old data cleared");

  // ---------- CONFIG ----------
  const USER_COUNT = 200;
  const ACTIVITY_COUNT = 10000;
  const DAYS_BACK = 180; // ~6 months

  // ---------- CREATE USERS ----------
  const hashedPassword = await bcrypt.hash("password123", 10);

  const usersData: Prisma.UserCreateManyInput[] = Array.from({
    length: USER_COUNT,
  }).map(() => ({
    id: faker.string.uuid(),
    name: faker.person.fullName(),
    email: faker.internet.email(),
    password: hashedPassword,
    role: "USER" as Role,
    createdAt: randomDate(DAYS_BACK),
  }));

  await prisma.user.createMany({ data: usersData });

  console.log(`✔ Created ${USER_COUNT} users`);

  const users = await prisma.user.findMany({ select: { id: true } });

  // ---------- CREATE USER SETTINGS ----------
  await prisma.userSettings.createMany({
    data: users.map((u) => ({
      id: faker.string.uuid(),
      userId: u.id,
      theme: "light",
      emailNotifications: faker.datatype.boolean(),
      weeklyReports: faker.datatype.boolean(),
    })),
  });

  console.log("✔ User settings created");

  // ---------- CREATE ACTIVITY LOGS ----------
  console.log("⏳ Creating activities (~10k)...");

  const activityData = Array.from({ length: ACTIVITY_COUNT }).map(() => {
    const user = faker.helpers.arrayElement(users);
    return {
      id: faker.string.uuid(),
      userId: user.id,
      message: faker.hacker.phrase(),
      createdAt: randomDate(DAYS_BACK),
    };
  });

  const chunkSize = 1000;
  for (let i = 0; i < activityData.length; i += chunkSize) {
    await prisma.activity.createMany({
      data: activityData.slice(i, i + chunkSize),
    });
  }

  console.log(`✔ Created ${ACTIVITY_COUNT} activity logs`);

  // ---------- CREATE ANALYTICS SNAPSHOTS ----------
  const statsSnapshots = Array.from({ length: 30 }).map(() => ({
    id: faker.string.uuid(),
    users: faker.number.int({ min: 1000, max: 5000 }),
    revenue: faker.number.int({ min: 5000, max: 40000 }),
    sessions: faker.number.int({ min: 2000, max: 10000 }),
    conversion: faker.number.float({ min: 0.5, max: 5.0 }),
    createdAt: randomDate(DAYS_BACK),
  }));

  await prisma.analyticsStats.createMany({ data: statsSnapshots });
  console.log("✔ Analytics stats created");

  // ---------- CREATE TRAFFIC DATA ----------
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];

  await prisma.traffic.createMany({
    data: months.map((m) => ({
      id: faker.string.uuid(),
      month: m,
      users: faker.number.int({ min: 500, max: 5000 }),
      createdAt: randomDate(DAYS_BACK),
    })),
  });

  console.log("✔ Traffic data created");

  // ---------- CREATE FUNNEL DATA ----------
  await prisma.funnel.create({
    data: {
      id: faker.string.uuid(),
      impressions: faker.number.int({ min: 10000, max: 100000 }),
      visits: faker.number.int({ min: 5000, max: 50000 }),
      addToCart: faker.number.int({ min: 1000, max: 10000 }),
      conversions: faker.number.int({ min: 200, max: 5000 }),
      createdAt: randomDate(DAYS_BACK),
    },
  });

  console.log("✔ Funnel metrics created");

  console.log("🎉 Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
