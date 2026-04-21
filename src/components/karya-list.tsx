"use client";

import { useMemo, useState } from "react";
import { Search, Clock, ArrowDownAZ, User, History } from "lucide-react";
import { KaryaCard } from "@/components/karya-card";
import type { Karya } from "@/lib/types";

type SortKey = "newest" | "oldest" | "title" | "participant";

const SORT_OPTIONS: {
  value: SortKey;
  label: string;
  Icon: React.ComponentType<{ className?: string }>;
}[] = [
  { value: "newest", label: "Terbaru", Icon: Clock },
  { value: "oldest", label: "Terlama", Icon: History },
  { value: "title", label: "Judul A–Z", Icon: ArrowDownAZ },
  { value: "participant", label: "Peserta A–Z", Icon: User },
];

function sortKarya(list: Karya[], key: SortKey): Karya[] {
  const sorted = [...list];
  switch (key) {
    case "newest":
      return sorted.sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
      );
    case "oldest":
      return sorted.sort(
        (a, b) =>
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
      );
    case "title":
      return sorted.sort((a, b) =>
        a.title.localeCompare(b.title, "id", { sensitivity: "base" }),
      );
    case "participant":
      return sorted.sort((a, b) =>
        a.participant_name.localeCompare(b.participant_name, "id", {
          sensitivity: "base",
        }),
      );
  }
}

export function KaryaList({ karya }: { karya: Karya[] }) {
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortKey>("newest");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const base = q
      ? karya.filter(
          (k) =>
            k.title.toLowerCase().includes(q) ||
            k.participant_name.toLowerCase().includes(q),
        )
      : karya;
    return sortKarya(base, sort);
  }, [karya, query, sort]);

  return (
    <>
      <div className="mb-4">
        <label
          htmlFor="search"
          className="search-pill mx-auto flex h-12 w-full max-w-2xl items-center gap-3 px-5"
        >
          <Search className="size-4 shrink-0 text-muted-foreground" />
          <input
            id="search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari judul atau nama peserta…"
            className="flex-1 bg-transparent text-base text-foreground placeholder:text-muted-foreground focus:outline-none"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="text-xs font-medium text-[color:var(--google-blue)] hover:underline"
            >
              Bersihkan
            </button>
          )}
        </label>
      </div>

      <div
        className="mb-8 flex flex-wrap items-center justify-center gap-2"
        role="tablist"
        aria-label="Urutkan"
      >
        {SORT_OPTIONS.map(({ value, label, Icon }) => (
          <button
            key={value}
            type="button"
            role="tab"
            aria-selected={sort === value}
            data-active={sort === value}
            onClick={() => setSort(value)}
            className="chip"
          >
            <Icon className="size-3.5" />
            {label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-border surface-container py-20 text-center">
          <p className="text-base text-muted-foreground">
            {karya.length === 0
              ? "Belum ada karya. Jadilah yang pertama."
              : `Tidak ada karya yang cocok dengan "${query}".`}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((k, i) => (
            <KaryaCard key={k.id} karya={k} index={i} />
          ))}
        </div>
      )}
    </>
  );
}
