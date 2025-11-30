import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardLoading() {
  return (
    <div className="space-y-6 p-6">
      {/* CARDS SKELETON */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="border p-4 rounded-lg dark:bg-neutral-900">
            <Skeleton className="h-4 w-24 mb-3" />
            <Skeleton className="h-6 w-16" />
          </div>
        ))}
      </div>

      {/* CHART SKELETON */}
      <div className="border rounded-lg dark:bg-neutral-900 p-6">
        <Skeleton className="h-6 w-40 mb-4" />
        <Skeleton className="h-64 w-full" />
      </div>

      {/* ACTIVITY TABLE SKELETON */}
      <div className="border rounded-lg dark:bg-neutral-900 p-6">
        <Skeleton className="h-6 w-32 mb-4" />
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex justify-between mb-3">
            <div className="space-y-1">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-24" />
            </div>
            <Skeleton className="h-4 w-20" />
          </div>
        ))}
      </div>
    </div>
  );
}
