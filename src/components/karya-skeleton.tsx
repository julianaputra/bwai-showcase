import { Skeleton } from "@/components/ui/skeleton";

export function KaryaCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-xl bg-card ring-1 ring-foreground/10">
      <Skeleton className="aspect-video w-full rounded-none" />
      <div className="space-y-2 p-4">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </div>
      <div className="flex items-center justify-between border-t bg-muted/50 px-4 py-3">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="size-3.5 rounded-full" />
      </div>
    </div>
  );
}

export function KaryaGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <KaryaCardSkeleton key={i} />
      ))}
    </div>
  );
}
