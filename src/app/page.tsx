import { Navbar } from "@/components/navbar";
import { KaryaList } from "@/components/karya-list";
import { createClient } from "@/lib/supabase/server";
import type { Karya } from "@/lib/types";

export const revalidate = 60;

export default async function Home() {
  const supabase = await createClient();
  const { data: karya } = await supabase
    .from("karya")
    .select("*")
    .order("created_at", { ascending: false });

  const list: Karya[] = karya ?? [];

  return (
    <>
      <Navbar />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10">
        <section className="mb-10">
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Karya Peserta Workshop
          </h1>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            Showcase website karya peserta Build with AI Workshop. Login dengan
            Google untuk menambahkan karya Anda.
          </p>
        </section>

        <KaryaList karya={list} />
      </main>
      <footer className="border-t py-6 text-center text-xs text-muted-foreground">
        BwAI Showcase · Workshop Build with AI
      </footer>
    </>
  );
}
