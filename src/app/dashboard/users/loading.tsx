import { Skeleton } from "@/components/ui/skeleton";

export default function UsersLoading() {
  return (
    <div className="space-y-6 p-6">
      <Skeleton className="h-8 w-40" />

      {/* Search + Filter */}
      <div className="flex justify-between">
        <Skeleton className="h-10 w-72" />
        <Skeleton className="h-10 w-32" />
      </div>

      {/* Table Skeleton */}
      <div className="border rounded-lg dark:bg-neutral-900 p-4 space-y-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="flex justify-between border-b pb-3 dark:border-neutral-700"
          >
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-24" />
          </div>
        ))}
      </div>
    </div>
  );
}
