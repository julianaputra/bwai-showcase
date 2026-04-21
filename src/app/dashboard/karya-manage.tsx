"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { ArrowUpRight, Pencil, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { KaryaForm } from "@/app/dashboard/karya-form";
import { deleteKarya } from "@/app/dashboard/actions";
import { type Karya, thumbnailUrl } from "@/lib/types";

export function KaryaManage({ karya }: { karya: Karya }) {
  const router = useRouter();
  const [editOpen, setEditOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pending, startTransition] = useTransition();

  function onDelete() {
    startTransition(async () => {
      const result = await deleteKarya();
      if (!result.ok) {
        toast.error(result.error);
        return;
      }
      toast.success("Karya dihapus");
      setConfirmOpen(false);
      router.refresh();
    });
  }

  return (
    <>
      <article className="elev-1 overflow-hidden rounded-3xl border border-border bg-card">
        <div className="aspect-[16/9] w-full overflow-hidden bg-[color:var(--paper-soft)]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={thumbnailUrl(karya.url)}
            alt={karya.title}
            className="size-full object-cover object-top"
          />
        </div>
        <div className="grid grid-cols-1 gap-6 p-6 sm:grid-cols-[1fr_auto] sm:p-8">
          <div>
            <span className="eyebrow">Karya terdaftar</span>
            <h2 className="mt-1 font-display text-2xl font-medium tracking-tight sm:text-3xl">
              <span className="gemini-text">{karya.title}</span>
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              oleh {karya.participant_name}
            </p>
            <a
              href={karya.url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-[color:var(--google-blue)] hover:underline"
            >
              {prettyHost(karya.url)}
              <ArrowUpRight className="size-3.5" />
            </a>
          </div>
          <div className="flex flex-wrap gap-2 sm:flex-col sm:items-end">
            <button
              onClick={() => setEditOpen(true)}
              className="inline-flex h-10 items-center gap-2 rounded-full border border-border bg-background px-5 text-sm font-medium text-foreground transition-colors hover:bg-[color:var(--paper-soft)]"
            >
              <Pencil className="size-3.5" />
              Edit
            </button>
            <button
              onClick={() => setConfirmOpen(true)}
              className="inline-flex h-10 items-center gap-2 rounded-full border border-[color:var(--google-red)]/30 bg-background px-5 text-sm font-medium text-[color:var(--google-red)] transition-colors hover:bg-[color:var(--google-red)]/10"
            >
              <Trash2 className="size-3.5" />
              Hapus
            </button>
          </div>
        </div>
      </article>

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-display text-2xl font-medium">
              Edit karya
            </DialogTitle>
            <DialogDescription>
              Perbarui detail karya Anda di showcase.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-2">
            <KaryaForm
              mode="edit"
              karya={karya}
              onDone={() => setEditOpen(false)}
            />
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-display text-2xl font-medium">
              Hapus karya?
            </DialogTitle>
            <DialogDescription>
              Tindakan ini tidak dapat dibatalkan. Karya Anda akan dihapus
              permanen dari showcase.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4 flex justify-end gap-2">
            <button
              onClick={() => setConfirmOpen(false)}
              disabled={pending}
              className="inline-flex h-10 items-center rounded-full px-5 text-sm font-medium text-[color:var(--google-blue)] hover:bg-[color:var(--accent)]"
            >
              Batal
            </button>
            <button
              onClick={onDelete}
              disabled={pending}
              className="inline-flex h-10 items-center rounded-full bg-[color:var(--google-red)] px-5 text-sm font-medium text-white transition-colors hover:brightness-110 disabled:opacity-60"
            >
              {pending ? "Menghapus…" : "Ya, hapus"}
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

function prettyHost(url: string) {
  try {
    return new URL(url).host.replace(/^www\./, "");
  } catch {
    return url;
  }
}
