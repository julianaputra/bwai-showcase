"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Check, Edit2, LogIn, Send } from "lucide-react";
import Link from "next/link";
import confetti from "canvas-confetti";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { upsertKesan } from "./actions";

interface Props {
  isLoggedIn: boolean;
  initialWords: string[];
}

export function KesanForm({ isLoggedIn, initialWords }: Props) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [isPending, startTransition] = useTransition();
  const [isEditing, setIsEditing] = useState(false);

  const hasSubmitted = initialWords.length > 0;

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === " ") e.preventDefault();
  }

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      const result = await upsertKesan(formData);
      if (!result.ok) {
        toast.error(result.error);
        return;
      }
      setIsEditing(false);
      router.refresh();
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#1a73e8", "#ea4335", "#fbbc04", "#34a853", "#9b72cb"],
      });
    });
  }

  if (!isLoggedIn) {
    return (
      <div className="surface-container flex items-center gap-3 rounded-2xl px-5 py-4">
        <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[color:var(--google-blue)]">
          <LogIn className="size-4 text-white" />
        </span>
        <div className="min-w-0">
          <p className="text-sm font-medium">Login dulu, yuk!</p>
          <p className="text-xs text-muted-foreground">
            Kamu perlu login untuk mengirim kesan.
          </p>
        </div>
        <Link
          href="/login"
          className="ml-auto shrink-0 inline-flex h-9 items-center gap-2 rounded-full bg-[color:var(--google-blue)] px-4 text-sm font-medium text-white transition-colors hover:brightness-110"
        >
          Sign in
        </Link>
      </div>
    );
  }

  if (hasSubmitted && !isEditing) {
    return (
      <div className="surface-container flex items-center gap-3 rounded-2xl px-5 py-4">
        <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[color:var(--google-green)]">
          <Check className="size-4 text-white" />
        </span>
        <div className="min-w-0">
          <p className="text-sm font-medium">Kesanmu sudah tercatat!</p>
          <p className="text-xs text-muted-foreground">
            {initialWords.join(" · ")}
          </p>
        </div>
        <button
          onClick={() => setIsEditing(true)}
          className="ml-auto shrink-0 inline-flex h-9 items-center gap-1.5 rounded-full border border-border px-3 text-xs font-medium text-foreground transition-colors hover:bg-muted"
        >
          <Edit2 className="size-3" />
          Edit
        </button>
      </div>
    );
  }

  return (
    <form
      key={initialWords.join(",")}
      ref={formRef}
      action={handleSubmit}
      className="space-y-3"
    >
      <div className="flex flex-col gap-3 sm:flex-row">
        <Input
          name="word1"
          placeholder="Kata pertama *"
          defaultValue={initialWords[0] ?? ""}
          maxLength={30}
          autoComplete="off"
          autoFocus
          required
          disabled={isPending}
          onKeyDown={handleKeyDown}
          className="rounded-full"
        />
        <Input
          name="word2"
          placeholder="Kata kedua (opsional)"
          defaultValue={initialWords[1] ?? ""}
          maxLength={30}
          autoComplete="off"
          disabled={isPending}
          onKeyDown={handleKeyDown}
          className="rounded-full"
        />
        <Input
          name="word3"
          placeholder="Kata ketiga (opsional)"
          defaultValue={initialWords[2] ?? ""}
          maxLength={30}
          autoComplete="off"
          disabled={isPending}
          onKeyDown={handleKeyDown}
          className="rounded-full"
        />
        <Button
          type="submit"
          disabled={isPending}
          className="shrink-0 rounded-full gap-2"
        >
          <Send className="size-3.5" />
          {isPending ? "Menyimpan…" : hasSubmitted ? "Perbarui" : "Kirim"}
        </Button>
      </div>
      <div className="flex items-center justify-between">
        <p className="text-xs text-muted-foreground">
          Minimal 1 kata, maksimal 3 kata. Satu kata tanpa spasi.
        </p>
        {hasSubmitted && (
          <button
            type="button"
            onClick={() => setIsEditing(false)}
            className="text-xs text-muted-foreground underline underline-offset-2 hover:text-foreground"
          >
            Batal
          </button>
        )}
      </div>
    </form>
  );
}
