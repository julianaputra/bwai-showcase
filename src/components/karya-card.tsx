import { ExternalLink } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { type Karya, thumbnailUrl } from "@/lib/types";

export function KaryaCard({ karya }: { karya: Karya }) {
  return (
    <a
      href={karya.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group block"
    >
      <Card className="overflow-hidden p-0 transition-shadow hover:shadow-lg">
        <div className="relative aspect-video w-full overflow-hidden bg-muted">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={thumbnailUrl(karya.url)}
            alt={karya.title}
            loading="lazy"
            className="size-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.02]"
          />
        </div>
        <CardContent className="p-4">
          <h3 className="line-clamp-1 text-base font-semibold tracking-tight">
            {karya.title}
          </h3>
          <p className="mt-1 line-clamp-1 text-sm text-muted-foreground">
            {karya.participant_name}
          </p>
        </CardContent>
        <CardFooter className="flex items-center justify-between gap-2 border-t px-4 py-3 text-xs text-muted-foreground">
          <span className="truncate">{prettyHost(karya.url)}</span>
          <ExternalLink className="size-3.5 shrink-0 opacity-60 transition-opacity group-hover:opacity-100" />
        </CardFooter>
      </Card>
    </a>
  );
}

function prettyHost(url: string) {
  try {
    return new URL(url).host.replace(/^www\./, "");
  } catch {
    return url;
  }
}
