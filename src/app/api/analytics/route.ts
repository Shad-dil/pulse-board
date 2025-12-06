import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

/* ---------------- UTILS ---------------- */
function shiftDateRange(from: Date, to: Date) {
  const diff = to.getTime() - from.getTime();
  const prevTo = new Date(from.getTime());
  const prevFrom = new Date(prevTo.getTime() - diff);
  return { prevFrom, prevTo };
}

function pctChange(current: number, prev: number) {
  if (!prev || prev === 0) return 0;
  return ((current - prev) / prev) * 100;
}

/* ---------------------------------------- */

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const from = searchParams.get("from");
    const to = searchParams.get("to");

    const fromDate = from ? new Date(from) : new Date("2023-01-01");
    const toDate = to ? new Date(to) : new Date();

    /* 1️ Calculate previous period window */
    const { prevFrom, prevTo } = shiftDateRange(fromDate, toDate);

    /* 2️ TRAFFIC */
    const traffic = await prisma.traffic.findMany({
      orderBy: { month: "asc" },
    });

    /* 3️ CURRENT ANALYTICS SNAPSHOTS */
    const stats = await prisma.analyticsStats.findMany({
      where: {
        createdAt: { gte: fromDate, lte: toDate },
      },
      orderBy: { createdAt: "asc" },
    });

    /* 4️ PREVIOUS PERIOD SNAPSHOTS */
    const statsPrev = await prisma.analyticsStats.findMany({
      where: {
        createdAt: { gte: prevFrom, lte: prevTo },
      },
      orderBy: { createdAt: "asc" },
    });

    /* 5️ FUNNEL */
    const funnel = await prisma.funnel.findFirst();

    /* 6️ ACTIVITY */
    const activity = await prisma.activity.findMany({
      take: 10,
      orderBy: { createdAt: "desc" },
      include: { user: true },
    });

    /* 7️ USERS */
    const totalUsers = await prisma.user.count();

    /* 8️ DAU */
    const dau = await prisma.activity.groupBy({
      by: ["userId"],
      where: {
        createdAt: {
          gte: new Date(new Date().setHours(0, 0, 0, 0)),
        },
      },
    });

    /* 9️ MAU */
    const mau = await prisma.activity.groupBy({
      by: ["userId"],
      where: {
        createdAt: {
          gte: new Date(Date.now() - 30 * 86400 * 1000),
        },
      },
    });

    /* 10 CHURN */
    const churn = mau.length
      ? ((totalUsers - mau.length) / totalUsers) * 100
      : 0;

    /* 11️ ARPU */
    const totalRevenue = stats.reduce((a, b) => a + Number(b.revenue), 0);
    const arpu = totalUsers ? totalRevenue / totalUsers : 0;

    /* 12️ PREVIOUS PERIOD STATS CALC */
    const prevRevenue = statsPrev.reduce((a, b) => a + Number(b.revenue), 0);
    const prevSessions = statsPrev.reduce((a, b) => a + Number(b.sessions), 0);
    const prevConv = statsPrev.reduce((a, b) => a + Number(b.conversion), 0);
    const prevUsers = statsPrev.reduce((a, b) => a + Number(b.users), 0);

    const prevArpu = totalUsers > 0 ? prevRevenue / totalUsers : 0;

    /* 13️ DELTA PERCENTAGE VALUES */
    const delta = {
      users: pctChange(stats.length ? stats.at(-1)!.users : 0, prevUsers),
      revenue: pctChange(totalRevenue, prevRevenue),
      sessions: pctChange(
        stats.length ? stats.at(-1)!.sessions : 0,
        prevSessions
      ),
      conversion: pctChange(
        stats.length ? stats.at(-1)!.conversion : 0,
        prevConv
      ),
      arpu: pctChange(arpu, prevArpu),
      dau: pctChange(dau.length, dau.length), // fake for seed dataset
      mau: pctChange(mau.length, mau.length), // fake
      churn: pctChange(churn, churn), // fake
    };

    /* 14️ MULTI-SERIES CHART DATA */
    const chartSeries = {
      labels: stats.map((s) => s.createdAt.toISOString().split("T")[0]),
      users: traffic.map((t) => t.users),
      revenue: stats.map((s) => s.revenue),
      sessions: stats.map((s) => s.sessions),
    };

    /* 15 FINAL PAYLOAD */
    return NextResponse.json({
      stats,
      statsPrev,
      delta,
      traffic,
      funnel: funnel ?? {
        impressions: 0,
        visits: 0,
        addToCart: 0,
        conversions: 0,
      },
      activity: activity ?? [],
      totalUsers,
      dau: dau.length,
      mau: mau.length,
      churn,
      arpu,
      chartSeries,
    });
  } catch (err) {
    console.error("Analytics API Error:", err);
    return NextResponse.json(
      { error: "Failed to load analytics" },
      { status: 500 }
    );
  }
}
