import { Skeleton } from "@/components/ui/skeleton";

export default function SettingsLoading() {
  return (
    <div className="space-y-6 p-6">
      <Skeleton className="h-8 w-40" />

      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="p-6 border rounded-lg dark:bg-neutral-900 space-y-4"
        >
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-1/2" />
        </div>
      ))}
    </div>
  );
}
