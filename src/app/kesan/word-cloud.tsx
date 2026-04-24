"use client";

import { useEffect, useRef, useState } from "react";
import { Expand, Shrink } from "lucide-react";

export interface WordEntry {
  word: string;
  count: number;
}

const COLORS = [
  "#1a73e8",
  "#ea4335",
  "#34a853",
  "#9b72cb",
  "#ff8f43",
  "#d96570",
  "#00897b",
  "#f4511e",
  "#0288d1",
  "#7b1fa2",
];

function wordHash(word: string): number {
  let h = 0;
  for (let i = 0; i < word.length; i++) {
    h = (Math.imul(31, h) + word.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

function getStyle(word: string, count: number, minCount: number, maxCount: number) {
  const hash = wordHash(word);
  const range = maxCount - minCount || 1;
  const normalized = (count - minCount) / range;

  const fontSize = 0.9 + normalized * 4.6;
  const color = COLORS[hash % COLORS.length];
  const rotation = (hash % 21) - 10;
  const fontWeight = normalized > 0.7 ? 700 : normalized > 0.35 ? 600 : 500;

  return { fontSize, color, rotation, fontWeight };
}

function Cloud({ words }: { words: WordEntry[] }) {
  const maxCount = Math.max(...words.map((w) => w.count));
  const minCount = Math.min(...words.map((w) => w.count));
  const sorted = [...words].sort((a, b) => b.count - a.count);

  return (
    <>
      {sorted.map(({ word, count }, i) => {
        const { fontSize, color, rotation, fontWeight } = getStyle(
          word,
          count,
          minCount,
          maxCount
        );
        return (
          <span
            key={word}
            title={`${count}×`}
            className="rise inline-block cursor-default select-none font-display transition-transform duration-200 hover:scale-110"
            style={{
              fontSize: `${fontSize}rem`,
              color,
              fontWeight,
              transform: `rotate(${rotation}deg)`,
              animationDelay: `${Math.min(i * 40, 600)}ms`,
              lineHeight: 1.2,
            }}
          >
            {word}
          </span>
        );
      })}
    </>
  );
}

export function WordCloud({ words }: { words: WordEntry[] }) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  function enterFullscreen() {
    containerRef.current?.requestFullscreen();
  }

  function exitFullscreen() {
    document.exitFullscreen();
  }

  function toggle() {
    isFullscreen ? exitFullscreen() : enterFullscreen();
  }

  useEffect(() => {
    function onFsChange() {
      setIsFullscreen(!!document.fullscreenElement);
    }
    document.addEventListener("fullscreenchange", onFsChange);
    return () => document.removeEventListener("fullscreenchange", onFsChange);
  }, []);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape" && isFullscreen) exitFullscreen();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isFullscreen]);

  const isEmpty = words.length === 0;

  return (
    <div
      ref={containerRef}
      className={`relative flex flex-wrap items-center justify-center gap-x-6 gap-y-2 overflow-hidden rounded-3xl border border-border bg-paper-soft transition-all ${
        isFullscreen ? "min-h-screen px-16 py-20" : "min-h-[320px] px-8 py-12"
      }`}
    >
      {isEmpty ? (
        <p className="text-center text-sm text-muted-foreground">
          Belum ada kesan yang ditulis.
          <br />
          Jadilah yang pertama!
        </p>
      ) : (
        <Cloud words={words} />
      )}

      {!isEmpty && (
        <button
          onClick={toggle}
          title={isFullscreen ? "Keluar fullscreen" : "Fullscreen"}
          className="absolute bottom-4 right-4 flex size-9 items-center justify-center rounded-full border border-border bg-background/80 text-muted-foreground backdrop-blur-sm transition-colors hover:bg-background hover:text-foreground"
        >
          {isFullscreen ? <Shrink className="size-4" /> : <Expand className="size-4" />}
        </button>
      )}
    </div>
  );
}
