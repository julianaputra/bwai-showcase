import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { KaryaList } from "@/components/karya-list";
import { GeminiSparkle } from "@/components/gemini-sparkle";
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
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 sm:px-6">
        <section className="relative flex flex-col items-center justify-center pt-20 pb-16 text-center sm:pt-28 sm:pb-24">
          {/* Soft conic glow behind hero */}
          <div
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-10 -z-10 size-[420px] -translate-x-1/2 rounded-full glow-conic"
          />

          <span className="mb-7 inline-flex items-center gap-2 rounded-full border border-border bg-background/80 px-4 py-1.5 text-xs font-medium text-foreground backdrop-blur">
            <GeminiSparkle className="size-4 sparkle-pulse" />
            Build with AI · Indonesia
          </span>

          <h1 className="rise font-display text-[clamp(3rem,11vw,7.5rem)] font-medium leading-[1.02] tracking-tight">
            <span className="text-foreground">BwAI </span>
            <span className="gemini-text">Showcase</span>
          </h1>

          <p
            className="rise mt-5 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg"
            style={{ animationDelay: "120ms" }}
          >
            Koleksi website yang dibangun peserta Build with AI Workshop.
            Jelajahi, cari, dan dukung karya teman-temanmu.
          </p>

          <div
            className="rise mt-10 flex flex-wrap items-center justify-center gap-3"
            style={{ animationDelay: "220ms" }}
          >
            <Link
              href="/dashboard"
              className="elev-1 elev-hover inline-flex h-12 items-center gap-2 rounded-full bg-[color:var(--google-blue)] px-7 text-sm font-medium text-white transition-colors hover:brightness-110"
            >
              <GeminiSparkle gradient={false} className="size-4 text-white" />
              Submit karya
            </Link>
            <a
              href="https://docs.google.com/presentation/d/1aol-GCASmsT7v_jNkMzZ-q1dlyo2UQICVDb6SjKOC5A/edit?usp=sharing"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-12 items-center gap-2 rounded-full border border-border bg-background px-7 text-sm font-medium text-foreground transition-colors hover:bg-[color:var(--paper-soft)]"
            >
              Lihat materi
            </a>
          </div>

          <div
            className="rise mt-14 grid w-full max-w-2xl grid-cols-4 gap-0 overflow-hidden rounded-2xl border border-border bg-card text-center"
            style={{ animationDelay: "340ms" }}
          >
            {[
              { label: "Karya", value: list.length, color: "var(--google-blue)" },
              { label: "Peserta", value: new Set(list.map((k) => k.participant_name)).size, color: "var(--google-red)" },
              { label: "Domain", value: uniqueHosts(list), color: "var(--google-yellow)" },
              { label: "Minggu", value: "1", color: "var(--google-green)" },
            ].map((s, i) => (
              <div
                key={s.label}
                className={`flex flex-col gap-1 py-5 ${i > 0 ? "border-l border-border" : ""}`}
              >
                <span
                  className="mx-auto h-1 w-8 rounded-full"
                  style={{ background: s.color }}
                />
                <span className="mt-2 font-display text-2xl font-medium tabular-nums">
                  {s.value}
                </span>
                <span className="text-xs text-muted-foreground">{s.label}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="pb-24">
          <div className="mb-8 flex items-baseline justify-between">
            <h2 className="font-display text-2xl font-medium tracking-tight sm:text-3xl">
              Karya peserta
            </h2>
            <span className="text-sm text-muted-foreground tabular-nums">
              {list.length} karya
            </span>
          </div>
          <KaryaList karya={list} />
        </section>
      </main>

      <footer className="mt-8 border-t border-border surface-container">
        <div className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-8 px-4 py-10 sm:grid-cols-3 sm:px-6">
          <div>
            <div className="flex items-center gap-2">
              <GeminiSparkle className="size-5" />
              <div className="font-display text-xl font-medium tracking-tight">
                <span style={{ color: "var(--google-blue)" }}>B</span>
                <span style={{ color: "var(--google-red)" }}>w</span>
                <span style={{ color: "var(--google-yellow)" }}>A</span>
                <span style={{ color: "var(--google-green)" }}>I</span>
                <span className="text-foreground"> Showcase</span>
              </div>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              Workshop · Build with AI · Indonesia
            </p>
          </div>
          <div>
            <span className="eyebrow-strong block">Navigasi</span>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <Link href="/" className="text-foreground/80 hover:text-[color:var(--google-blue)]">
                  Showcase
                </Link>
              </li>
              <li>
                <Link href="/undian" className="text-foreground/80 hover:text-[color:var(--google-blue)]">
                  Undian
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="text-foreground/80 hover:text-[color:var(--google-blue)]">
                  Dashboard
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <span className="eyebrow-strong block">Colophon</span>
            <p className="mt-3 text-sm text-muted-foreground">
              Dibuat dengan Google Sans, Roboto, Next.js, dan Gemini.
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}

function uniqueHosts(list: Karya[]): number {
  const hosts = new Set<string>();
  for (const k of list) {
    try {
      hosts.add(new URL(k.url).host.replace(/^www\./, ""));
    } catch {}
  }
  return hosts.size;
}
