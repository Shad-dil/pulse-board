"use client";

import { useEffect, useMemo, useState } from "react";
import DashboardCards from "@/components/dashboard/DashboardCards";
import DashboardChart from "@/components/dashboard/DashboardCharts";
import DashboardTable from "@/components/dashboard/DashboardTable";
import Funnel from "@/components/dashboard/Funnel";
import { Button } from "@/components/ui/button";
import { fmtDateShort } from "@/lib/format";
import DashboardActivity from "@/components/dashboard/DashboardActivity";
import { useAnalytics } from "@/hooks/useAnalytics";
import ProtectedRoute from "@/components/ProtectedRoute";

function fmtDate(d: Date) {
  return d.toISOString().slice(0, 10);
}

export default function DashboardHome() {
  const [preset, setPreset] = useState<"7" | "30" | "60" | "ytd">("30");
  const [productTitle, setProductTitle] = useState("Loading...");

  useEffect(() => {
    // Simulate fetching dynamic data after component mounts
    setTimeout(() => {
      const fetchedTitle = "PulseBoard || Dashboard";
      setProductTitle(fetchedTitle);

      // Update the page title using the browser API
      document.title = fetchedTitle;
    }, 1000);
  }, []);
  const { from, to } = useMemo(() => {
    const toDate = new Date();
    let fromDate = new Date();

    if (preset === "7") {
      fromDate.setDate(toDate.getDate() - 6);
    } else if (preset === "30") {
      fromDate.setDate(toDate.getDate() - 29);
    } else if (preset === "60") {
      fromDate.setDate(toDate.getDate() - 59);
    } else {
      fromDate = new Date(toDate.getFullYear(), 0, 1);
    }

    return { from: fmtDate(fromDate), to: fmtDate(toDate) };
  }, [preset]);

  // -------------------- FETCH ANALYTICS --------------------
  const { data, isLoading, isError } = useAnalytics({ from, to });

  // safe fallback funnel & activity
  const funnelData = data?.funnel ?? {
    impressions: 0,
    visits: 0,
    addToCart: 0,
    conversions: 0,
  };
  const activityData = data?.activity ?? [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <Button
            variant={preset === "7" ? "default" : "ghost"}
            onClick={() => setPreset("7")}
          >
            7d
          </Button>
          <Button
            variant={preset === "30" ? "default" : "ghost"}
            onClick={() => setPreset("30")}
          >
            30d
          </Button>
          <Button
            variant={preset === "60" ? "default" : "ghost"}
            onClick={() => setPreset("60")}
          >
            60d
          </Button>
          <Button
            variant={preset === "ytd" ? "default" : "ghost"}
            onClick={() => setPreset("ytd")}
          >
            YTD
          </Button>
        </div>

        <div className="text-sm text-gray-400">
          Showing: {fmtDateShort(from)} — {fmtDateShort(to)}
        </div>
      </div>

      {/* Pass from/to into cards */}
      <DashboardCards from={from} to={to} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <DashboardChart from={from} to={to} />

          {/* Activity uses live data (safe default) */}
        </div>

        <div className="space-y-6">
          {/* Funnel uses live funnel data */}
          <Funnel from={from} to={to} />

          {/* <DashboardTable from={from} to={to} /> */}
          <ProtectedRoute allowedRoles={["ADMIN"]}>
            <DashboardActivity activity={activityData} />
          </ProtectedRoute>
        </div>
      </div>

      {isLoading && (
        <div className="text-center text-sm text-gray-500">
          Loading analytics...
        </div>
      )}

      {isError && (
        <div className="text-center text-sm text-red-500">
          Failed to load analytics.
        </div>
      )}
    </div>
  );
}
