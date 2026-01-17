"use client";

import { useState } from "react";
import type { ListDTO } from "@/app/actions/lists";
import type { CardDTO } from "@/app/actions/cards";
import CardItem from "@/app/components/CardItem";

export default function ListColumn({
  list,
  cards,
  onRename,
  onDelete,
  onAddCard,
  onOpenCard,
}: {
  list: ListDTO;
  cards: CardDTO[];
  onRename: (name: string) => Promise<void>;
  onDelete: () => Promise<void>;
  onAddCard: (title: string) => Promise<void>;
  onOpenCard: (card: CardDTO) => void;
}) {
  const [edit, setEdit] = useState(false);
  const [name, setName] = useState(list.name);

  const [newCardTitle, setNewCardTitle] = useState("");

  return (
    <div className="min-w-[320px] max-w-[320px] bg-slate-100 rounded-xl border border-slate-200 shadow-sm p-3">
      <div className="flex items-start justify-between gap-2 mb-3">
        {!edit ? (
          <h2 className="font-bold text-slate-900">{list.name}</h2>
        ) : (
          <input
            className="w-full px-2 py-1 rounded border border-slate-300 outline-none focus:ring-2 focus:ring-slate-400 bg-white"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoFocus
          />
        )}

        <div className="flex gap-2">
          {!edit ? (
            <button
              className="text-xs px-2 py-1 rounded bg-white hover:bg-slate-200 border border-slate-200 transition"
              onClick={() => {
                setName(list.name);
                setEdit(true);
              }}
            >
              Rename
            </button>
          ) : (
            <>
              <button
                className="text-xs px-2 py-1 rounded bg-white hover:bg-slate-200 border border-slate-200 transition"
                onClick={() => setEdit(false)}
              >
                Cancel
              </button>
              <button
                className="text-xs px-2 py-1 rounded bg-slate-900 text-white hover:bg-slate-800 transition"
                onClick={async () => {
                  await onRename(name);
                  setEdit(false);
                }}
              >
                Save
              </button>
            </>
          )}

          <button
            className="text-xs px-2 py-1 rounded bg-red-50 text-red-700 hover:bg-red-100 transition"
            onClick={onDelete}
          >
            Delete
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        {cards.map((c) => (
          <CardItem key={c._id} card={c} onOpen={() => onOpenCard(c)} />
        ))}
      </div>

      <form
        className="mt-3 flex gap-2"
        onSubmit={async (e) => {
          e.preventDefault();
          const t = newCardTitle.trim();
          if (!t) return;
          await onAddCard(t);
          setNewCardTitle("");
        }}
      >
        <input
          className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white outline-none focus:ring-2 focus:ring-slate-400"
          placeholder="Add a card..."
          value={newCardTitle}
          onChange={(e) => setNewCardTitle(e.target.value)}
        />
        <button className="px-3 py-2 rounded-lg bg-slate-900 text-white hover:bg-slate-800 transition">
          Add
        </button>
      </form>
    </div>
  );
}
