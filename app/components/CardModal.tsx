"use client";

import { useEffect, useMemo, useState } from "react";
import type { CardDTO } from "@/app/actions/cards";

export default function CardModal({
  open,
  card,
  onClose,
  onSave,
  onDelete,
}: {
  open: boolean;
  card: CardDTO | null;
  onClose: () => void;
  onSave: (patch: { title?: string; description?: string }) => Promise<void>;
  onDelete: () => Promise<void>;
}) {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");

  useEffect(() => {
    if (!card) return;
    setTitle(card.title);
    setDesc(card.description ?? "");
  }, [card]);

  useEffect(() => {
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (open) window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, [open, onClose]);

  if (!open || !card) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* backdrop */}
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      {/* modal */}
      <div className="relative w-[92vw] max-w-xl rounded-2xl bg-white shadow-xl border border-slate-200 p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-lg font-bold text-slate-900">Card</h3>
          <button
            onClick={onClose}
            className="px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 transition"
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        <div className="mt-4 space-y-3">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">
              Title
            </label>
            <input
              className="w-full px-3 py-2 rounded-lg border border-slate-300 outline-none focus:ring-2 focus:ring-slate-400"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">
              Description
            </label>
            <textarea
              className="w-full min-h-[120px] px-3 py-2 rounded-lg border border-slate-300 outline-none focus:ring-2 focus:ring-slate-400"
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              placeholder="Write a description..."
            />
          </div>
        </div>

        <div className="mt-5 flex items-center justify-between gap-3">
          <button
            onClick={onDelete}
            className="px-4 py-2 rounded-lg bg-red-50 text-red-700 hover:bg-red-100 transition"
          >
            Delete
          </button>

          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 transition"
            >
              Cancel
            </button>
            <button
              onClick={async () => {
                await onSave({ title, description: desc });
              }}
              className="px-4 py-2 rounded-lg bg-slate-900 text-white hover:bg-slate-800 transition"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
