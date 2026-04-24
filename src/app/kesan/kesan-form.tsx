"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Check, LogIn, Send } from "lucide-react";
import Link from "next/link";
import confetti from "canvas-confetti";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { submitKesan } from "./actions";

interface Props {
  isLoggedIn: boolean;
}

export function KesanForm({ isLoggedIn }: Props) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [isPending, startTransition] = useTransition();
  const [submitted, setSubmitted] = useState(false);

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === " ") e.preventDefault();
  }

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      const result = await submitKesan(formData);
      if (!result.ok) {
        toast.error(result.error);
        return;
      }
      setSubmitted(true);
      formRef.current?.reset();
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

  if (submitted) {
    return (
      <div className="surface-container flex items-center gap-3 rounded-2xl px-5 py-4">
        <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[color:var(--google-green)]">
          <Check className="size-4 text-white" />
        </span>
        <div className="min-w-0">
          <p className="text-sm font-medium">Terima kasih!</p>
          <p className="text-xs text-muted-foreground">
            Kata-katamu sudah muncul di word cloud.
          </p>
        </div>
        <button
          onClick={() => setSubmitted(false)}
          className="ml-auto shrink-0 text-xs text-[color:var(--google-blue)] underline underline-offset-2 hover:opacity-80"
        >
          Tambah lagi
        </button>
      </div>
    );
  }

  return (
    <form ref={formRef} action={handleSubmit} className="space-y-3">
      <div className="flex flex-col gap-3 sm:flex-row">
        <Input
          name="word1"
          placeholder="Kata pertama *"
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
          maxLength={30}
          autoComplete="off"
          disabled={isPending}
          onKeyDown={handleKeyDown}
          className="rounded-full"
        />
        <Input
          name="word3"
          placeholder="Kata ketiga (opsional)"
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
          {isPending ? "Mengirim…" : "Kirim"}
        </Button>
      </div>
      <p className="text-xs text-muted-foreground">
        Minimal 1 kata, maksimal 3 kata. Satu kata tanpa spasi.
      </p>
    </form>
  );
}
