"use client";

import { useEffect, useRef, useState } from "react";
import confetti from "canvas-confetti";
import { ArrowUpRight, Shuffle, RotateCcw, Check } from "lucide-react";
import { toast } from "sonner";
import { type Karya, thumbnailUrl } from "@/lib/types";
import { playTick, playWin } from "@/lib/sound";
import { GeminiSparkle } from "@/components/gemini-sparkle";

const STORAGE_KEY = "bwai-undian-picked";

const GOOGLE_COLORS = ["#1a73e8", "#ea4335", "#fbbc04", "#34a853"];

function fireConfetti() {
  const duration = 1800;
  const end = Date.now() + duration;
  (function frame() {
    confetti({
      particleCount: 3,
      angle: 60,
      spread: 70,
      startVelocity: 55,
      origin: { x: 0, y: 0.7 },
      colors: GOOGLE_COLORS,
      ticks: 250,
    });
    confetti({
      particleCount: 3,
      angle: 120,
      spread: 70,
      startVelocity: 55,
      origin: { x: 1, y: 0.7 },
      colors: GOOGLE_COLORS,
      ticks: 250,
    });
    if (Date.now() < end) requestAnimationFrame(frame);
  })();
  confetti({
    particleCount: 140,
    spread: 120,
    origin: { y: 0.55 },
    colors: GOOGLE_COLORS,
    startVelocity: 45,
    ticks: 300,
  });
}

export function Raffle({ karya }: { karya: Karya[] }) {
  const [picked, setPicked] = useState<string[]>([]);
  const [current, setCurrent] = useState<Karya | null>(null);
  const [spinning, setSpinning] = useState(false);
  const [winner, setWinner] = useState<Karya | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setPicked(JSON.parse(raw));
    } catch {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(picked));
    } catch {}
  }, [picked]);

  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const remaining = karya.filter((k) => !picked.includes(k.id));
  const empty = karya.length === 0;

  function spin() {
    if (spinning) return;
    if (remaining.length === 0) {
      toast.error("Semua peserta sudah terundi. Reset daftar dulu.");
      return;
    }

    setWinner(null);
    setSpinning(true);

    const pool = remaining;
    const finalIdx = Math.floor(Math.random() * pool.length);
    const finalPick = pool[finalIdx];

    const totalDuration = 3000;
    const start = performance.now();
    let lastSwap = start;

    const tick = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / totalDuration, 1);
      const interval = 55 + progress * progress * 450;

      if (now - lastSwap >= interval) {
        lastSwap = now;
        const random = pool[Math.floor(Math.random() * pool.length)];
        setCurrent(random);
        playTick();
      }

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        setCurrent(finalPick);
        setWinner(finalPick);
        setPicked((p) => [...p, finalPick.id]);
        setSpinning(false);
        playWin();
        fireConfetti();
      }
    };

    rafRef.current = requestAnimationFrame(tick);
  }

  function reset() {
    setPicked([]);
    setWinner(null);
    setCurrent(null);
    toast.success("Daftar peserta terundi di-reset");
  }

  return (
    <div className="space-y-10">
      <section className="relative">
        {winner && (
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 -z-10 flex items-center justify-center"
          >
            <div className="size-[520px] rounded-full glow-conic" />
          </div>
        )}
        <div
          className={`elev-1 relative overflow-hidden rounded-3xl border bg-card transition-colors ${
            winner ? "border-[color:var(--google-blue)]" : "border-border"
          }`}
        >
          {winner && (
            <>
              <GeminiSparkle className="absolute left-6 top-6 size-6 sparkle-pulse" />
              <GeminiSparkle className="absolute right-8 top-10 size-4 sparkle-pulse" />
              <GeminiSparkle className="absolute left-10 bottom-12 size-5 sparkle-pulse" />
              <GeminiSparkle className="absolute right-6 bottom-6 size-5 sparkle-pulse" />
            </>
          )}
          {empty ? (
            <div className="flex min-h-[52vh] items-center justify-center p-10 text-center">
              <p className="text-lg text-muted-foreground">
                Belum ada karya terdaftar.
              </p>
            </div>
          ) : current ? (
            <div className="relative flex min-h-[52vh] flex-col items-center justify-center px-6 py-16 text-center sm:px-12">
              {winner && (
                <span className="mb-6 inline-flex items-center gap-2 rounded-full bg-[color:var(--google-blue)] px-4 py-1.5 text-xs font-medium text-white">
                  <Check className="size-3.5" />
                  Maju ke depan
                </span>
              )}
              <span
                className={`text-xs font-medium uppercase tracking-wider ${
                  spinning
                    ? "animate-pulse text-[color:var(--google-blue)]"
                    : "text-muted-foreground"
                }`}
              >
                Peserta terpilih
              </span>
              <h2
                className={`mt-4 font-display text-[clamp(2.5rem,9vw,6rem)] font-medium leading-[1.02] tracking-tight ${
                  winner
                    ? "gemini-text"
                    : spinning
                      ? "text-foreground/80"
                      : "text-foreground"
                }`}
              >
                {current.participant_name}
              </h2>
              <p className="mt-4 max-w-xl text-lg text-muted-foreground sm:text-xl">
                {current.title}
              </p>
              {winner && (
                <a
                  href={winner.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-8 inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-5 py-2 text-sm font-medium text-foreground transition-colors hover:bg-[color:var(--paper-soft)]"
                >
                  Buka karya
                  <ArrowUpRight className="size-4" />
                </a>
              )}
            </div>
          ) : (
            <div className="flex min-h-[52vh] flex-col items-center justify-center gap-5 p-10 text-center">
              <div className="flex size-16 items-center justify-center rounded-full bg-[color:var(--paper-soft)]">
                <Shuffle className="size-7 text-[color:var(--google-blue)]" />
              </div>
              <div>
                <p className="font-display text-2xl font-medium tracking-tight text-foreground">
                  Siap mengundi
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Tekan tombol di bawah untuk memulai.
                </p>
              </div>
            </div>
          )}

          {winner && (
            <div className="border-t border-border bg-[color:var(--paper-soft)]">
              <div className="mx-auto flex max-w-3xl items-center gap-4 px-6 py-4">
                <div className="aspect-[16/10] w-24 shrink-0 overflow-hidden rounded-xl border border-border bg-background">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={thumbnailUrl(winner.url, 400, 250)}
                    alt={winner.title}
                    className="size-full object-cover object-top"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="eyebrow block">Karya</span>
                  <p className="mt-0.5 truncate font-medium text-foreground">
                    {winner.title}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="eyebrow">Aksi</span>
          <p className="mt-1 text-sm text-muted-foreground">
            {remaining.length} peserta tersisa di pool
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={spin}
            disabled={spinning || empty || remaining.length === 0}
            className="elev-1 elev-hover inline-flex h-11 items-center gap-2 rounded-full bg-[color:var(--google-blue)] px-6 text-sm font-medium text-white transition-colors hover:brightness-110 disabled:opacity-50"
          >
            <Shuffle className={`size-4 ${spinning ? "animate-spin" : ""}`} />
            {spinning ? "Mengundi…" : winner ? "Undi lagi" : "Mulai undi"}
          </button>
          {picked.length > 0 && (
            <button
              onClick={reset}
              disabled={spinning}
              className="inline-flex h-11 items-center gap-2 rounded-full border border-border bg-background px-5 text-sm font-medium text-foreground transition-colors hover:bg-[color:var(--paper-soft)] disabled:opacity-50"
            >
              <RotateCcw className="size-4" />
              Reset
            </button>
          )}
        </div>
      </section>

      <section>
        <div className="mb-4 flex items-baseline justify-between">
          <h3 className="font-display text-xl font-medium tracking-tight">
            Sudah terundi
            <span className="ml-2 text-muted-foreground tabular-nums">
              {picked.length}/{karya.length}
            </span>
          </h3>
          <span className="text-xs text-muted-foreground">
            Urutan panggilan
          </span>
        </div>
        {picked.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-border bg-[color:var(--paper-soft)] py-10 text-center text-sm text-muted-foreground">
            Belum ada nama yang terpanggil.
          </p>
        ) : (
          <ol className="overflow-hidden rounded-2xl border border-border bg-card">
            {karya
              .filter((k) => picked.includes(k.id))
              .sort((a, b) => picked.indexOf(a.id) - picked.indexOf(b.id))
              .map((k, i) => (
                <li
                  key={k.id}
                  className="flex items-center gap-3 border-b border-border px-4 py-3 text-sm last:border-b-0"
                >
                  <span
                    className="flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-medium text-white tabular-nums"
                    style={{
                      background: GOOGLE_COLORS[i % GOOGLE_COLORS.length],
                    }}
                  >
                    {i + 1}
                  </span>
                  <span className="flex-1 truncate">
                    <span className="font-medium text-foreground">
                      {k.participant_name}
                    </span>
                    <span className="ml-2 text-muted-foreground">
                      — {k.title}
                    </span>
                  </span>
                </li>
              ))}
          </ol>
        )}
      </section>
    </div>
  );
}
