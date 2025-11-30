"use client";

import { useEffect, useState } from "react";
import { useAnalytics } from "@/hooks/useAnalytics";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
} from "chart.js";

ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale);

export default function AnalyticsPage() {
  const [productTitle, setProductTitle] = useState("Loading...");

  useEffect(() => {
    // Simulate fetching dynamic data after component mounts
    setTimeout(() => {
      const fetchedTitle = "PulseBoard || Analytics";
      setProductTitle(fetchedTitle);

      // Update the page title using the browser API
      document.title = fetchedTitle;
    }, 1000);
  }, []);
  const [from, setFrom] = useState<string | undefined>(undefined);
  const [to, setTo] = useState<string | undefined>(undefined);

  const { data, isLoading, isFetching } = useAnalytics({ from, to });

  // quick date filters
  const setLastDays = (days: number) => {
    const now = new Date();
    const past = new Date();
    past.setDate(now.getDate() - days);

    setFrom(past.toISOString().split("T")[0]);
    setTo(now.toISOString().split("T")[0]);
  };

  const setYTD = () => {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 1);

    setFrom(start.toISOString().split("T")[0]);
    setTo(now.toISOString().split("T")[0]);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
        </div>
        <Skeleton className="h-80 w-full" />
      </div>
    );
  }

  const { stats, traffic, funnel, activity } = data;

  const latest = stats.length ? stats[stats.length - 1] : null;

  const kpiCards = [
    { label: "Users", value: latest?.users ?? 0 },
    { label: "Revenue", value: `$${latest?.revenue ?? 0}` },
    { label: "Sessions", value: latest?.sessions ?? 0 },
    { label: "Conversion", value: `${(latest?.conversion ?? 0).toFixed(2)}%` },
  ];

  const chartData = {
    labels: traffic?.length
      ? traffic.map((t: { month: string }) => t.month)
      : [],
    datasets: [
      {
        label: "User Growth",
        data: traffic?.length
          ? traffic.map((t: { users: string }) => t.users)
          : [],
        borderColor: "#4f46e5",
        borderWidth: 2,
        tension: 0.3,
      },
    ],
  };

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-semibold">Analytics</h2>

      {/* DATE FILTERS */}
      <Card>
        <CardContent className="p-4 space-y-4">
          <h3 className="font-medium">Filter by Date</h3>

          <div className="flex flex-wrap gap-3">
            <Button onClick={() => setLastDays(7)} variant="outline">
              Last 7 days
            </Button>

            <Button onClick={() => setLastDays(30)} variant="outline">
              Last 30 days
            </Button>

            <Button onClick={() => setLastDays(90)} variant="outline">
              Last 90 days
            </Button>

            <Button onClick={setYTD} variant="outline">
              Year to Date
            </Button>

            <Button
              onClick={() => {
                setFrom(undefined);
                setTo(undefined);
              }}
              variant="destructive"
            >
              Clear
            </Button>
          </div>

          {/* CUSTOM RANGE */}
          <div className="flex items-center gap-4 mt-3">
            <div>
              <label className="block text-sm mb-1">From</label>
              <input
                type="date"
                value={from || ""}
                onChange={(e) => setFrom(e.target.value)}
                className="border p-2 rounded dark:bg-neutral-900"
              />
            </div>

            <div>
              <label className="block text-sm mb-1">To</label>
              <input
                type="date"
                value={to || ""}
                onChange={(e) => setTo(e.target.value)}
                className="border p-2 rounded dark:bg-neutral-900"
              />
            </div>
          </div>

          {isFetching && (
            <p className="text-sm text-gray-500 mt-2">Updating...</p>
          )}
        </CardContent>
      </Card>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {kpiCards.map((item) => (
          <Card key={item.label}>
            <CardContent className="p-4">
              <p className="text-sm text-gray-500">{item.label}</p>
              <p className="text-xl font-semibold">{item.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* CHART */}
      <Card>
        <CardContent className="p-4">
          <h3 className="font-medium mb-4">User Growth</h3>
          <Line data={chartData} height={100} />
          {traffic.length === 0 && (
            <p className="text-sm text-gray-500 mt-4">
              No traffic data available.
            </p>
          )}
        </CardContent>
      </Card>

      {/* FUNNEL */}
      <Card>
        <CardContent className="p-4 space-y-3">
          <h3 className="font-medium mb-4">Funnel Metrics</h3>
          <p>Impressions: {funnel?.impressions ?? 0}</p>
          <p>Visits: {funnel?.visits ?? 0}</p>
          <p>Add to Cart: {funnel?.addToCart ?? 0}</p>
          <p>Conversions: {funnel?.conversions ?? 0}</p>
        </CardContent>
      </Card>

      {/* RECENT ACTIVITY */}
      <Card>
        <CardContent className="p-4 space-y-3">
          <h3 className="font-medium mb-4">Recent Activity</h3>
          {}
          {activity.length === 0 ? (
            <p className="text-sm text-gray-500">No recent activity found.</p>
          ) : (
            activity.map((a: any) => (
              <div key={a.id} className="border-b pb-2">
                <p className="font-medium">{a.user.name}</p>
                <p className="text-sm text-gray-500">{a.message}</p>
                <p className="text-xs text-gray-400">
                  {new Date(a.createdAt).toLocaleString()}
                </p>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
