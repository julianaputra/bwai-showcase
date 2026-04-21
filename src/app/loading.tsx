import { Skeleton } from "@/components/ui/skeleton";
import { KaryaGridSkeleton } from "@/components/karya-skeleton";

export default function Loading() {
  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur">
        <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between px-4">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="size-8 rounded-full" />
        </div>
      </header>
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10">
        <section className="mb-10 space-y-3">
          <Skeleton className="h-9 w-72" />
          <Skeleton className="h-5 w-full max-w-xl" />
        </section>
        <div className="mb-6 flex flex-col gap-3 sm:flex-row">
          <Skeleton className="h-9 flex-1" />
          <Skeleton className="h-9 w-48" />
        </div>
        <KaryaGridSkeleton />
      </main>
    </>
  );
}
