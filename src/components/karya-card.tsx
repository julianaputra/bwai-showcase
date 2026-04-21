import { ArrowUpRight } from "lucide-react";
import { type Karya, thumbnailUrl } from "@/lib/types";

type Props = {
  karya: Karya;
  index?: number;
};

const ACCENTS = [
  "var(--google-blue)",
  "var(--google-red)",
  "var(--google-yellow)",
  "var(--google-green)",
];

export function KaryaCard({ karya, index }: Props) {
  const accent = ACCENTS[(index ?? 0) % ACCENTS.length];

  return (
    <a
      href={karya.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group elev-1 elev-hover flex flex-col overflow-hidden rounded-3xl border border-border bg-card"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-[color:var(--paper-soft)]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={thumbnailUrl(karya.url)}
          alt={karya.title}
          loading="lazy"
          className="size-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.03]"
        />
        <span className="absolute top-3 right-3 inline-flex size-9 items-center justify-center rounded-full bg-background/95 opacity-0 shadow-md transition-all duration-300 ease-out group-hover:opacity-100 group-hover:-translate-y-0.5">
          <ArrowUpRight className="size-4 text-foreground" />
        </span>
      </div>

      <div className="flex items-start justify-between gap-3 p-5">
        <div className="min-w-0 flex-1">
          <h3 className="line-clamp-2 font-display text-lg font-medium leading-snug tracking-tight text-foreground transition-colors group-hover:text-[color:var(--google-blue)]">
            {karya.title}
          </h3>
          <div className="mt-2 flex items-center gap-2">
            <span
              className="inline-block size-2 shrink-0 rounded-full"
              style={{ background: accent }}
              aria-hidden
            />
            <p className="truncate text-sm text-muted-foreground">
              {karya.participant_name}
            </p>
          </div>
        </div>
        <span className="shrink-0 rounded-full bg-[color:var(--paper-soft)] px-2.5 py-1 font-mono text-[10.5px] text-muted-foreground">
          {prettyHost(karya.url)}
        </span>
      </div>
    </a>
  );
}

function prettyHost(url: string) {
  try {
    return new URL(url).host.replace(/^www\./, "");
  } catch {
    return "";
  }
}
