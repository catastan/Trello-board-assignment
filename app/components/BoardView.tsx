"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  createList,
  deleteList,
  renameList,
  type ListDTO,
} from "@/app/actions/lists";
import {
  createCard,
  deleteCard,
  getBoardData,
  updateCard,
  type BoardDataDTO,
  type CardDTO,
} from "@/app/actions/cards";
import ListColumn from "@/app/components/ListColumn";
import CardModal from "@/app/components/CardModal";
import { track } from "@/lib/analytics";

export default function BoardView({
  boardId,
  dataInitial,
}: {
  boardId: string;
  dataInitial: BoardDataDTO;
}) {
  const [data, setData] = useState<BoardDataDTO>(dataInitial);
  const [newListName, setNewListName] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [activeCard, setActiveCard] = useState<CardDTO | null>(null);

  const refresh = async () => setData(await getBoardData(boardId));

  const openCard = (card: CardDTO) => {
    setActiveCard(card);
    setModalOpen(true);
    track("card_opened");
  };

  const closeModal = () => {
    setModalOpen(false);
    setActiveCard(null);
  };

  if (!data.board) {
    return (
      <div className="max-w-3xl mx-auto">
        <Link href="/" className="text-slate-900 underline">
          ← Back to Boards
        </Link>
        <div className="mt-6 rounded-xl bg-white p-6 shadow border border-slate-200">
          Board not found.
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1400px] mx-auto">
      <header className="flex items-center justify-between gap-4 mb-6">
        <div>
          <Link
            href="/"
            className="text-slate-700 hover:text-slate-900 underline"
          >
            ← Boards
          </Link>
          <h1 className="text-2xl font-bold text-slate-900 mt-2">
            {data.board.name}
          </h1>
        </div>

        <form
          className="flex gap-2 items-center"
          onSubmit={async (e) => {
            e.preventDefault();
            const name = newListName.trim();
            if (!name) return;
            await createList(boardId, name);
            track("list_created", { name_length: name.length });
            setNewListName("");
            await refresh();
          }}
        >
          <input
            className="w-64 px-3 py-2 rounded-lg border border-slate-300 bg-white outline-none focus:ring-2 focus:ring-slate-400"
            placeholder="New list name..."
            value={newListName}
            onChange={(e) => setNewListName(e.target.value)}
          />
          <button className="px-4 py-2 rounded-lg bg-slate-900 text-white hover:bg-slate-800 transition">
            Add list
          </button>
        </form>
      </header>

      <section className="flex gap-4 overflow-x-auto pb-6">
        {data.lists.map((list) => (
          <ListColumn
            key={list._id}
            list={list}
            cards={data.cardsByList[list._id] ?? []}
            onRename={async (name) => {
              await renameList(list._id, name);
              track("list_renamed");
              await refresh();
            }}
            onDelete={async () => {
              await deleteList(list._id);
              track("list_deleted");
              await refresh();
            }}
            onAddCard={async (title) => {
              await createCard(list._id, title);
              track("card_created", { title_length: title.length });
              await refresh();
            }}
            onOpenCard={openCard}
          />
        ))}
      </section>

      <CardModal
        open={modalOpen}
        card={activeCard}
        onClose={closeModal}
        onSave={async (patch) => {
          if (!activeCard) return;
          await updateCard(activeCard._id, patch);
          track("card_updated");
          await refresh();
          closeModal();
        }}
        onDelete={async () => {
          if (!activeCard) return;
          await deleteCard(activeCard._id);
          track("card_deleted");
          await refresh();
          closeModal();
        }}
      />
    </div>
  );
}
