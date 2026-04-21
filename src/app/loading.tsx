import { Skeleton } from "@/components/ui/skeleton";
import { KaryaGridSkeleton } from "@/components/karya-skeleton";

export default function Loading() {
  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-border bg-background/90 backdrop-blur-md">
        <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6">
          <Skeleton className="h-5 w-36 rounded-md" />
          <Skeleton className="h-9 w-24 rounded-full" />
        </div>
      </header>
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 sm:px-6">
        <section className="flex flex-col items-center pt-16 pb-14 sm:pt-24 sm:pb-20">
          <Skeleton className="h-7 w-56 rounded-full" />
          <Skeleton className="mt-6 h-20 w-[70%] max-w-2xl rounded-2xl" />
          <Skeleton className="mt-5 h-5 w-[60%] max-w-xl rounded-md" />
          <div className="mt-9 flex gap-3">
            <Skeleton className="h-11 w-36 rounded-full" />
            <Skeleton className="h-11 w-36 rounded-full" />
          </div>
        </section>
        <section className="pb-24">
          <div className="mb-8 flex items-baseline justify-between">
            <Skeleton className="h-8 w-48 rounded-md" />
            <Skeleton className="h-5 w-16 rounded-md" />
          </div>
          <div className="mb-10 flex flex-col gap-4 sm:flex-row">
            <Skeleton className="h-12 flex-1 rounded-full" />
            <Skeleton className="h-12 w-full rounded-full sm:w-52" />
          </div>
          <KaryaGridSkeleton />
        </section>
      </main>
    </>
  );
}
