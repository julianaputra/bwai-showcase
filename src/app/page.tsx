import { Navbar } from "@/components/navbar";
import { KaryaCard } from "@/components/karya-card";
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

        {list.length === 0 ? (
          <div className="rounded-xl border border-dashed py-20 text-center">
            <p className="text-muted-foreground">
              Belum ada karya. Jadilah yang pertama!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {list.map((k) => (
              <KaryaCard key={k.id} karya={k} />
            ))}
          </div>
        )}
      </main>
      <footer className="border-t py-6 text-center text-xs text-muted-foreground">
        BwAI Showcase · Workshop Build with AI
      </footer>
    </>
  );
}
