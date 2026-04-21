import { Navbar } from "@/components/navbar";
import { GeminiSparkle } from "@/components/gemini-sparkle";
import { createClient } from "@/lib/supabase/server";
import { Raffle } from "@/app/undian/raffle";
import type { Karya } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function UndianPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("karya")
    .select("*")
    .order("created_at", { ascending: true });

  const list: Karya[] = data ?? [];

  return (
    <>
      <Navbar />
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-10 sm:px-6 sm:py-14">
        <div className="mb-10 flex flex-col items-start gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex items-start gap-3">
            <GeminiSparkle className="mt-2 size-6 sparkle-pulse" />
            <div>
              <span className="eyebrow">Undian peserta</span>
              <h1 className="mt-1 font-display text-4xl font-medium tracking-tight sm:text-5xl">
                <span className="gemini-text">Siapa</span> maju?
              </h1>
              <p className="mt-2 max-w-xl text-sm text-muted-foreground sm:text-base">
                Pengundian nama dari {list.length} peserta yang terdaftar.
                Setiap nama hanya bisa keluar satu kali.
              </p>
            </div>
          </div>
          <div className="surface-container rounded-2xl px-5 py-4 text-right">
            <span className="eyebrow">Pool</span>
            <p className="mt-1 font-display text-3xl font-medium tabular-nums tracking-tight">
              {list.length}
            </p>
          </div>
        </div>
        <Raffle karya={list} />
      </main>
    </>
  );
}
