import { Navbar } from "@/components/navbar";
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
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-10">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Undian Presentasi
          </h1>
          <p className="mt-2 text-muted-foreground">
            Acak peserta dari {list.length} karya yang terdaftar untuk maju
            presentasi.
          </p>
        </div>
        <Raffle karya={list} />
      </main>
    </>
  );
}
