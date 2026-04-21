import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur">
        <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between px-4">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="size-8 rounded-full" />
        </div>
      </header>
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-10">
        <div className="mb-8 flex flex-col items-center gap-2">
          <Skeleton className="h-9 w-64" />
          <Skeleton className="h-5 w-80" />
        </div>
        <div className="overflow-hidden rounded-2xl border bg-card">
          <Skeleton className="aspect-video w-full rounded-none" />
          <div className="space-y-3 p-6 text-center">
            <Skeleton className="mx-auto h-4 w-20" />
            <Skeleton className="mx-auto h-8 w-64" />
            <Skeleton className="mx-auto h-5 w-48" />
          </div>
        </div>
        <div className="mt-6 flex justify-center">
          <Skeleton className="h-11 w-40" />
        </div>
      </main>
    </>
  );
}
