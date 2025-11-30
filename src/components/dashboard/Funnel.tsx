"use client";

import { Card, CardContent } from "@/components/ui/card";
import { useAnalytics } from "@/hooks/useAnalytics";

export default function DashboardFunnel({
  from,
  to,
}: {
  from: string;
  to: string;
}) {
  const { data } = useAnalytics({ from, to });

  const funnel = data?.funnel ?? {
    impressions: 0,
    visits: 0,
    addToCart: 0,
    conversions: 0,
  };

  return (
    <Card>
      <CardContent className="p-4">
        <h3 className="font-medium mb-4">Funnel</h3>

        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span>Impressions</span>
            <span>{funnel.impressions}</span>
          </div>

          <div className="flex justify-between">
            <span>Visits</span>
            <span>{funnel.visits}</span>
          </div>

          <div className="flex justify-between">
            <span>Add to Cart</span>
            <span>{funnel.addToCart}</span>
          </div>

          <div className="flex justify-between">
            <span>Conversions</span>
            <span>{funnel.conversions}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
