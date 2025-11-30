"use client";

import "@/lib/chart"; // register components
import { Line } from "react-chartjs-2";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useAnalytics } from "@/hooks/useAnalytics";
import { fmtDateShort } from "@/lib/format";

export default function DashboardChart({
  from,
  to,
}: {
  from: string;
  to: string;
}) {
  const { data, isLoading } = useAnalytics({ from, to });

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-4">
          <Skeleton className="h-72 w-full" />
        </CardContent>
      </Card>
    );
  }

  const chartSeries = data?.chartSeries ?? {
    labels: [],
    users: [],
    revenue: [],
    sessions: [],
  };

  const chartData = {
    labels: chartSeries.labels,
    datasets: [
      {
        label: "Users",
        data: chartSeries.users,
        borderColor: "#6366f1",
        backgroundColor: "rgba(99,102,241,0.08)",
        borderWidth: 2,
        tension: 0.3,
        yAxisID: "y_users",
      },
      {
        label: "Revenue",
        data: chartSeries.revenue,
        borderColor: "#10b981",
        backgroundColor: "rgba(16,185,129,0.06)",
        borderWidth: 2,
        tension: 0.3,
        yAxisID: "y_revenue",
      },
      {
        label: "Sessions",
        data: chartSeries.sessions,
        borderColor: "#f59e0b",
        backgroundColor: "rgba(245,158,11,0.06)",
        borderWidth: 2,
        tension: 0.3,
        yAxisID: "y_users",
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: "index" as const, intersect: false },
    stacked: false,
    plugins: { legend: { position: "top" as const } },
    scales: {
      x: {
        ticks: { maxRotation: 0 },
        grid: { color: "rgba(255,255,255,0.03)" },
      },
      y_users: {
        type: "linear" as const,
        position: "left" as const,
        grid: { color: "rgba(255,255,255,0.03)" },
      },
      y_revenue: {
        type: "linear" as const,
        position: "right" as const,
        grid: { drawOnChartArea: false, color: "rgba(255,255,255,0.02)" },
      },
    },
  };

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-medium">User Growth</h3>
          <div className="text-sm text-gray-400">
            {fmtDateShort(from)} — {fmtDateShort(to)}
          </div>
        </div>
        <div style={{ height: 320 }}>
          {chartSeries.labels.length === 0 ? (
            <p className="text-sm text-gray-500">No chart data.</p>
          ) : (
            <Line data={chartData} options={options} />
          )}
        </div>
      </CardContent>
    </Card>
  );
}
