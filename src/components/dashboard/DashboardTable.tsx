"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useAnalytics } from "@/hooks/useAnalytics";
import { fmtDateShort } from "@/lib/format";

export default function DashboardTable({
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
        <CardContent className="p-4 space-y-3">
          <Skeleton className="h-12" />
          <Skeleton className="h-12" />
          <Skeleton className="h-12" />
        </CardContent>
      </Card>
    );
  }

  const activity = data?.activity ?? [];

  return (
    <Card className="h-[400px] overflow-y-scroll">
      <CardContent className="p-4">
        <h3 className="font-medium mb-4">Recent Activity</h3>

        {activity.length === 0 ? (
          <p className="text-sm text-gray-500">No recent activity found.</p>
        ) : (
          <div className="space-y-4">
            {activity.map((a: any) => (
              <div key={a.id} className="border-b pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-medium">
                      {a.user?.name ?? "Unknown User"}
                    </div>
                    <div className="text-sm text-gray-400">{a.message}</div>
                  </div>
                  <div className="text-xs text-gray-500">
                    {fmtDateShort(a.createdAt)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
