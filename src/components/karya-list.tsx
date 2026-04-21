"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { KaryaCard } from "@/components/karya-card";
import { Input } from "@/components/ui/input";
import type { Karya } from "@/lib/types";

type SortKey = "newest" | "oldest" | "title" | "participant";

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: "newest", label: "Terbaru" },
  { value: "oldest", label: "Terlama" },
  { value: "title", label: "Judul (A–Z)" },
  { value: "participant", label: "Peserta (A–Z)" },
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
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari judul atau nama peserta..."
            className="pl-9"
          />
        </div>
        <div className="flex items-center gap-2">
          <label
            htmlFor="sort"
            className="text-sm text-muted-foreground whitespace-nowrap"
          >
            Urutkan
          </label>
          <select
            id="sort"
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            className="h-9 rounded-md border border-input bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-xl border border-dashed py-20 text-center">
          <p className="text-muted-foreground">
            {karya.length === 0
              ? "Belum ada karya. Jadilah yang pertama!"
              : `Tidak ada karya cocok dengan "${query}".`}
          </p>
        </div>
      ) : (
        <>
          <p className="mb-3 text-xs text-muted-foreground">
            {filtered.length} dari {karya.length} karya
          </p>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((k) => (
              <KaryaCard key={k.id} karya={k} />
            ))}
          </div>
        </>
      )}
    </>
  );
}
