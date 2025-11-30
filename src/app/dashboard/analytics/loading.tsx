import { Skeleton } from "@/components/ui/skeleton";

export default function AnalyticsLoading() {
  return (
    <div className="space-y-6 p-6">
      <Skeleton className="h-8 w-40" />

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="p-4 border rounded-lg dark:bg-neutral-900">
            <Skeleton className="h-4 w-24 mb-2" />
            <Skeleton className="h-6 w-16" />
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="p-6 border rounded-lg dark:bg-neutral-900">
        <Skeleton className="h-6 w-40 mb-4" />
        <Skeleton className="h-60 w-full" />
      </div>

      {/* Funnel */}
      <div className="space-y-4 p-6 border rounded-lg dark:bg-neutral-900">
        <Skeleton className="h-6 w-40" />
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-3 w-full" />
        ))}
      </div>
    </div>
  );
}
