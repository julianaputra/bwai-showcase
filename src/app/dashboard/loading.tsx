import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-border bg-background/90 backdrop-blur-md">
        <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6">
          <Skeleton className="h-5 w-36 rounded-md" />
          <Skeleton className="size-9 rounded-full" />
        </div>
      </header>
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-10 sm:px-6 sm:py-14">
        <div className="mb-8 space-y-3">
          <Skeleton className="h-4 w-24 rounded-md" />
          <Skeleton className="h-10 w-2/3 rounded-md" />
          <Skeleton className="h-4 w-full max-w-md rounded-md" />
        </div>
        <div className="overflow-hidden rounded-3xl border border-border bg-card">
          <Skeleton className="aspect-[16/9] w-full rounded-none" />
          <div className="space-y-3 p-6 sm:p-8">
            <Skeleton className="h-4 w-24 rounded-md" />
            <Skeleton className="h-8 w-3/4 rounded-md" />
            <Skeleton className="h-4 w-1/2 rounded-md" />
          </div>
        </div>
      </main>
    </>
  );
}
