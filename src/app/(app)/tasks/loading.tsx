import { Skeleton } from "@/components/shared/Skeleton";

export default function TasksLoading() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-24" />
        <Skeleton className="h-9 w-28" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, col) => (
          <div key={col} className="space-y-3">
            <Skeleton className="h-6 w-32" />
            {Array.from({ length: 4 }).map((_, row) => (
              <Skeleton key={row} className="h-20 w-full rounded-lg" />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
