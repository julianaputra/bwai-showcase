"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { Expand, Shrink } from "lucide-react";

const ReactWordcloud = dynamic(() => import("react-wordcloud"), { ssr: false });

export interface WordEntry {
  word: string;
  count: number;
}

const COLORS = [
  "#1a73e8", "#ea4335", "#34a853", "#9b72cb",
  "#ff8f43", "#d96570", "#00897b", "#f4511e",
  "#0288d1", "#7b1fa2",
];

function wordHash(word: string): number {
  let h = 0;
  for (let i = 0; i < word.length; i++) h = (Math.imul(31, h) + word.charCodeAt(i)) | 0;
  return Math.abs(h);
}

export function WordCloud({ words }: { words: WordEntry[] }) {
  const [containerRef, setContainerRef] = useState<HTMLDivElement | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  function toggle() {
    if (isFullscreen) { document.exitFullscreen(); } else { containerRef?.requestFullscreen(); }
  }

  useEffect(() => {
    const onFsChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", onFsChange);
    return () => document.removeEventListener("fullscreenchange", onFsChange);
  }, []);

  const isEmpty = words.length === 0;

  const cloudWords = words.map(({ word, count }) => ({ text: word, value: count }));

  const callbacks = {
    getWordColor: (word: { text: string }) =>
      COLORS[wordHash(word.text) % COLORS.length],
    getWordTooltip: (word: { text: string; value: number }) =>
      `${word.text}: ${word.value}×`,
  };

  const options = {
    rotations: 2,
    rotationAngles: [-45, 45] as [number, number],
    fontFamily: "Google Sans, Roboto, Arial, sans-serif",
    fontSizes: [14, 80] as [number, number],
    padding: 8,
    deterministic: false,
    enableTooltip: true,
    transitionDuration: 500,
  };

  return (
    <div
      ref={setContainerRef}
      className={`relative overflow-hidden rounded-3xl border border-border bg-paper-soft transition-all ${
        isFullscreen ? "h-screen" : "h-[480px]"
      }`}
    >
      {isEmpty ? (
        <div className="flex h-full items-center justify-center">
          <p className="text-center text-sm text-muted-foreground">
            Belum ada kesan yang ditulis.
            <br />
            Jadilah yang pertama!
          </p>
        </div>
      ) : (
        <ReactWordcloud
          words={cloudWords}
          options={options}
          callbacks={callbacks}
          minSize={[1, 1]}
        />
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
