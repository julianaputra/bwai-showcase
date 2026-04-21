"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Pencil, Trash2, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
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
      <div className="overflow-hidden rounded-xl border bg-card">
        <div className="aspect-video w-full bg-muted">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={thumbnailUrl(karya.url)}
            alt={karya.title}
            className="size-full object-cover object-top"
          />
        </div>
        <div className="p-5">
          <h2 className="text-lg font-semibold tracking-tight">{karya.title}</h2>
          <p className="text-sm text-muted-foreground">{karya.participant_name}</p>
          <a
            href={karya.url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-flex items-center gap-1 text-sm text-primary hover:underline"
          >
            {karya.url}
            <ExternalLink className="size-3.5" />
          </a>

          <div className="mt-5 flex flex-wrap gap-2">
            <Button onClick={() => setEditOpen(true)} size="sm">
              <Pencil className="size-4" />
              Edit
            </Button>
            <Button
              onClick={() => setConfirmOpen(true)}
              size="sm"
              variant="destructive"
            >
              <Trash2 className="size-4" />
              Hapus
            </Button>
          </div>
        </div>
      </div>

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit karya</DialogTitle>
            <DialogDescription>
              Perbarui detail karya Anda.
            </DialogDescription>
          </DialogHeader>
          <KaryaForm
            mode="edit"
            karya={karya}
            onDone={() => setEditOpen(false)}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Hapus karya?</DialogTitle>
            <DialogDescription>
              Tindakan ini tidak dapat dibatalkan. Karya Anda akan dihapus
              permanen dari showcase.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose
              render={<Button variant="outline">Batal</Button>}
            />
            <Button
              variant="destructive"
              onClick={onDelete}
              disabled={pending}
            >
              {pending ? "Menghapus..." : "Ya, hapus"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
