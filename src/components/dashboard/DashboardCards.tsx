"use client";

import "@/lib/chart"; // registers ChartJS components
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useAnalytics } from "@/hooks/useAnalytics";
import { Line } from "react-chartjs-2";
import { fmtCurrency, fmtCurrency2, fmtNumber, fmtPercent } from "@/lib/format";
import { useAnimatedNumber } from "@/lib/animate";
import { useMemo } from "react";

type Props = {
  from: string;
  to: string;
};

export default function DashboardCards({ from, to }: Props) {
  // ✅ Hooks always first
  const { data, isLoading } = useAnalytics({ from, to });

  // safe reads (always defined)
  const stats = data?.stats ?? [];
  const latest = stats.length ? stats[stats.length - 1] : null;

  const totalUsers = data?.totalUsers ?? 0;
  const revenueVal = latest ? Number(latest.revenue ?? 0) : 0;
  const sessionsVal = latest ? Number(latest.sessions ?? 0) : 0;
  const conversionVal = latest ? Number(latest.conversion ?? 0) : 0;
  const dau = data?.dau ?? 0;
  const mau = data?.mau ?? 0;
  const churn = data?.churn ?? 0;
  const arpu = data?.arpu ?? 0;

  // always call hooks
  const usersAnim = useAnimatedNumber(isLoading ? 0 : Number(totalUsers));
  const revenueAnim = useAnimatedNumber(isLoading ? 0 : revenueVal);
  const sessionsAnim = useAnimatedNumber(isLoading ? 0 : sessionsVal);
  const convAnim = useAnimatedNumber(isLoading ? 0 : conversionVal);
  const dauAnim = useAnimatedNumber(isLoading ? 0 : dau);
  const mauAnim = useAnimatedNumber(isLoading ? 0 : mau);
  const churnAnim = useAnimatedNumber(isLoading ? 0 : churn);
  const arpuAnim = useAnimatedNumber(isLoading ? 0 : arpu);

  // sparkline data (safe defaults)
  const sparkLabels = data?.chartSeries?.labels ?? [];
  const sparkUsers = data?.chartSeries?.users ?? [];
  const sparkRevenue = data?.chartSeries?.revenue ?? [];
  const sparkSessions = data?.chartSeries?.sessions ?? [];

  // deltas from API (numbers, percent)
  const delta = data?.delta ?? {
    users: 0,
    revenue: 0,
    sessions: 0,
    conversion: 0,
    arpu: 0,
    dau: 0,
    mau: 0,
    churn: 0,
  };

  // small chart options
  const smallOptions = {
    responsive: true,
    maintainAspectRatio: false,
    elements: { point: { radius: 0 } },
    scales: { x: { display: false }, y: { display: false } },
    plugins: { legend: { display: false }, tooltip: { enabled: false } },
  } as const;

  const items = useMemo(
    () => [
      {
        key: "users",
        label: "Total Users",
        value: fmtNumber(usersAnim),
        spark: sparkUsers,
        sparkColor: "#6366f1",
        delta: delta.users,
      },
      {
        key: "revenue",
        label: "Revenue",
        value: fmtCurrency(Math.round(revenueAnim)),
        spark: sparkRevenue,
        sparkColor: "#10b981",
        delta: delta.revenue,
      },
      {
        key: "sessions",
        label: "Sessions",
        value: fmtNumber(Math.round(sessionsAnim)),
        spark: sparkSessions,
        sparkColor: "#f59e0b",
        delta: delta.sessions,
      },
      {
        key: "conversion",
        label: "Conversion",
        value: fmtPercent(convAnim, 2),
        spark: sparkRevenue,
        sparkColor: "#8b5cf6",
        delta: delta.conversion,
      },
      {
        key: "dau",
        label: "DAU",
        value: fmtNumber(Math.round(dauAnim)),
        spark: sparkUsers,
        sparkColor: "#06b6d4",
        delta: delta.dau,
      },
      {
        key: "mau",
        label: "MAU",
        value: fmtNumber(Math.round(mauAnim)),
        spark: sparkUsers,
        sparkColor: "#7c3aed",
        delta: delta.mau,
      },
      {
        key: "churn",
        label: "Churn (%)",
        value: fmtPercent(churnAnim, 2),
        spark: [],
        sparkColor: "#ef4444",
        delta: delta.churn,
      },
      {
        key: "arpu",
        label: "ARPU",
        value: fmtCurrency2(arpuAnim),
        spark: sparkRevenue,
        sparkColor: "#06b6d4",
        delta: delta.arpu,
      },
    ],
    [
      usersAnim,
      revenueAnim,
      sessionsAnim,
      convAnim,
      dauAnim,
      mauAnim,
      churnAnim,
      arpuAnim,
      sparkUsers,
      sparkRevenue,
      sparkSessions,
      delta,
    ]
  );

  // helper for delta badge (Style A)
  function DeltaBadge({ value }: { value: number }) {
    const sign = value > 0 ? "▲" : value < 0 ? "▼" : "";
    const abs = Math.abs(value);
    const isPositive = value > 0;

    const cls = isPositive
      ? "text-emerald-400"
      : value < 0
      ? "text-red-400"
      : "text-gray-400";

    return (
      <span className={`text-sm font-medium ${cls}`} aria-live="polite">
        {sign} {abs.toFixed(1)}%
      </span>
    );
  }

  // Render
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {isLoading
        ? // skeletons (hooks already called above)
          Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-28 w-full" />
          ))
        : items.map((it) => (
            <Card
              key={it.key}
              className="hover:dark:border hover:dark:border-green-900 cursor-pointer"
            >
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-gray-400">{it.label}</p>
                    <div className="text-xl font-semibold mt-1">{it.value}</div>
                  </div>

                  <div className="flex flex-col items-end">
                    <div className="w-28 h-8">
                      {it.spark && it.spark.length > 0 ? (
                        <Line
                          data={{
                            labels: sparkLabels,
                            datasets: [
                              {
                                data: it.spark,
                                borderColor: it.sparkColor,
                                borderWidth: 2,
                                fill: false,
                              },
                            ],
                          }}
                          options={smallOptions}
                          height={40}
                        />
                      ) : null}
                    </div>

                    <div className="mt-2">
                      <DeltaBadge value={it.delta ?? 0} />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
    </div>
  );
}
