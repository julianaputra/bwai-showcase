import { Navbar } from "@/components/navbar";
import { GeminiSparkle } from "@/components/gemini-sparkle";
import { createClient } from "@/lib/supabase/server";
import { WordCloud } from "./word-cloud";
import { KesanForm } from "./kesan-form";

export const dynamic = "force-dynamic";

export default async function KesanPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data } = await supabase.from("kesan").select("word");

  const freq: Record<string, number> = {};
  for (const row of data ?? []) {
    const w = row.word.trim().toLowerCase();
    if (w) freq[w] = (freq[w] ?? 0) + 1;
  }
  const words = Object.entries(freq).map(([word, count]) => ({ word, count }));
  const totalSubmissions = data?.length ?? 0;

  // Fetch this user's existing submission
  let initialWords: string[] = [];
  if (user) {
    const { data: myRows } = await supabase
      .from("kesan")
      .select("word")
      .eq("user_id", user.id);
    initialWords = (myRows ?? []).map((r) => r.word);
  }

  return (
    <>
      <Navbar />
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-10 sm:px-6 sm:py-14">
        <div className="mb-10 flex flex-col items-start gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex items-start gap-3">
            <GeminiSparkle className="mt-2 size-6 sparkle-pulse" />
            <div>
              <span className="eyebrow">Kesan peserta</span>
              <h1 className="mt-1 font-display text-4xl font-medium tracking-tight sm:text-5xl">
                Kata-kata <span className="gemini-text">kalian</span>
              </h1>
              <p className="mt-2 max-w-xl text-sm text-muted-foreground sm:text-base">
                Tulis hingga 3 kata yang menggambarkan workshop ini. Semakin
                banyak yang menulis kata yang sama, semakin besar tampilannya.
              </p>
            </div>
          </div>
          <div className="surface-container shrink-0 rounded-2xl px-5 py-4 text-right">
            <span className="eyebrow">Total kata unik</span>
            <p className="mt-1 font-display text-3xl font-medium tabular-nums tracking-tight">
              {words.length}
            </p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              dari {totalSubmissions} kiriman
            </p>
          </div>
        </div>

        <div className="mb-8">
          <KesanForm isLoggedIn={!!user} initialWords={initialWords} />
        </div>

        <WordCloud words={words} />
      </main>
    </>
  );
}
