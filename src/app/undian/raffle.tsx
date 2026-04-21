"use client";

import { useEffect, useRef, useState } from "react";
import confetti from "canvas-confetti";
import { ExternalLink, Shuffle, RotateCcw, Trophy, Check } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { type Karya, thumbnailUrl } from "@/lib/types";
import { playTick, playWin } from "@/lib/sound";

function fireConfetti() {
  const duration = 1600;
  const end = Date.now() + duration;
  const colors = ["#facc15", "#f43f5e", "#22c55e", "#3b82f6", "#a855f7"];
  (function frame() {
    confetti({
      particleCount: 4,
      angle: 60,
      spread: 70,
      startVelocity: 55,
      origin: { x: 0, y: 0.7 },
      colors,
    });
    confetti({
      particleCount: 4,
      angle: 120,
      spread: 70,
      startVelocity: 55,
      origin: { x: 1, y: 0.7 },
      colors,
    });
    if (Date.now() < end) requestAnimationFrame(frame);
  })();
  confetti({
    particleCount: 120,
    spread: 110,
    origin: { y: 0.6 },
    colors,
  });
}

const STORAGE_KEY = "bwai-undian-picked";

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

    const totalDuration = 2800;
    const start = performance.now();
    let lastSwap = start;

    const tick = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / totalDuration, 1);
      // ease-out cubic → interval grows as progress grows (slowing down)
      const interval = 50 + progress * progress * 400;

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

  const display = current;
  const empty = karya.length === 0;

  return (
    <div className="space-y-6">
      <div
        className={`relative overflow-hidden rounded-2xl border bg-card transition-shadow ${
          winner ? "ring-2 ring-primary shadow-lg" : ""
        }`}
      >
        {empty ? (
          <div className="flex aspect-video items-center justify-center">
            <p className="text-muted-foreground">Belum ada karya terdaftar.</p>
          </div>
        ) : display ? (
          <>
            <div className="aspect-video w-full bg-muted">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={thumbnailUrl(display.url)}
                alt={display.title}
                className={`size-full object-cover object-top transition-opacity ${
                  spinning ? "opacity-70" : "opacity-100"
                }`}
              />
            </div>
            <div className="p-6 text-center">
              {winner && (
                <div className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                  <Trophy className="size-3.5" />
                  Maju ke depan!
                </div>
              )}
              <p
                className={`text-xs uppercase tracking-wide text-muted-foreground ${
                  spinning ? "animate-pulse" : ""
                }`}
              >
                Peserta
              </p>
              <h2 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">
                {display.participant_name}
              </h2>
              <p className="mt-2 text-muted-foreground">{display.title}</p>
              {winner && (
                <a
                  href={winner.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center gap-1 text-sm text-primary hover:underline"
                >
                  Buka karya
                  <ExternalLink className="size-3.5" />
                </a>
              )}
            </div>
          </>
        ) : (
          <div className="flex aspect-video flex-col items-center justify-center gap-2 text-center">
            <Shuffle className="size-10 text-muted-foreground/50" />
            <p className="text-muted-foreground">
              Klik <span className="font-medium text-foreground">Mulai undi</span>{" "}
              untuk mengacak peserta.
            </p>
          </div>
        )}
      </div>

      <div className="flex flex-wrap items-center justify-center gap-2">
        <Button
          onClick={spin}
          disabled={spinning || empty || remaining.length === 0}
          size="lg"
          className="h-11 min-w-40"
        >
          <Shuffle className={`size-4 ${spinning ? "animate-spin" : ""}`} />
          {spinning ? "Mengundi..." : winner ? "Undi lagi" : "Mulai undi"}
        </Button>
        {picked.length > 0 && (
          <Button
            onClick={reset}
            variant="outline"
            size="lg"
            className="h-11"
            disabled={spinning}
          >
            <RotateCcw className="size-4" />
            Reset
          </Button>
        )}
      </div>

      <div className="rounded-xl border bg-card p-5">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-sm font-medium">Sudah terundi</h3>
          <span className="text-xs text-muted-foreground">
            {picked.length} / {karya.length}
          </span>
        </div>
        {picked.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Belum ada peserta yang terundi.
          </p>
        ) : (
          <ul className="flex flex-wrap gap-2">
            {karya
              .filter((k) => picked.includes(k.id))
              .map((k) => (
                <li
                  key={k.id}
                  className="inline-flex items-center gap-1.5 rounded-full bg-muted px-3 py-1 text-xs"
                >
                  <Check className="size-3 text-primary" />
                  {k.participant_name}
                </li>
              ))}
          </ul>
        )}
      </div>
    </div>
  );
}
