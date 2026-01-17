"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  createBoard,
  deleteBoard,
  getBoards,
  renameBoard,
  type BoardDTO,
} from "@/app/actions/boards";
import { track } from "@/lib/analytics";

export default function BoardsGrid({
  boardsInitial,
}: {
  boardsInitial: BoardDTO[];
}) {
  const [boards, setBoards] = useState<BoardDTO[]>(boardsInitial);
  const [newName, setNewName] = useState("");

  const refresh = async () => setBoards(await getBoards());

  const onCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    const name = newName.trim();
    if (!name) return;

    await createBoard(name);
    track("board_created", { name_length: name.length });
    setNewName("");
    await refresh();
  };

  return (
    <div className="w-full max-w-6xl">
      <header className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Boards</h1>
          <p className="text-slate-600 text-sm">
            Create a board, then add lists and cards.
          </p>
        </div>
      </header>

      <form onSubmit={onCreate} className="flex gap-2 mb-6">
        <input
          className="w-full max-w-md px-3 py-2 rounded-lg border border-slate-300 bg-white outline-none focus:ring-2 focus:ring-slate-400"
          placeholder="New board name..."
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
        />
        <button
          type="submit"
          className="px-4 py-2 rounded-lg bg-slate-900 text-white hover:bg-slate-800 transition"
        >
          Create
        </button>
      </form>

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {boards.map((b) => (
          <BoardTile
            key={b._id}
            board={b}
            onRename={async (name) => {
              await renameBoard(b._id, name);
              track("board_renamed");
              await refresh();
            }}
            onDelete={async () => {
              await deleteBoard(b._id);
              track("board_deleted");
              await refresh();
            }}
            onOpen={() => track("board_opened")}
          />
        ))}
      </section>
    </div>
  );
}

function BoardTile({
  board,
  onRename,
  onDelete,
  onOpen,
}: {
  board: BoardDTO;
  onRename: (name: string) => Promise<void>;
  onDelete: () => Promise<void>;
  onOpen: () => void;
}) {
  const [edit, setEdit] = useState(false);
  const [name, setName] = useState(board.name);

  return (
    <div className="rounded-xl bg-white shadow-md border border-slate-200 p-4">
      <div className="flex items-start justify-between gap-2">
        {!edit ? (
          <Link
            href={`/boards/${board._id}`}
            onClick={onOpen}
            className="text-lg font-semibold text-slate-900 hover:underline"
          >
            {board.name}
          </Link>
        ) : (
          <input
            className="w-full px-2 py-1 rounded border border-slate-300 outline-none focus:ring-2 focus:ring-slate-400"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoFocus
          />
        )}

        <div className="flex gap-2">
          {!edit ? (
            <button
              onClick={() => {
                setName(board.name);
                setEdit(true);
              }}
              className="text-sm px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 transition"
            >
              Rename
            </button>
          ) : (
            <>
              <button
                onClick={() => setEdit(false)}
                className="text-sm px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 transition"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  await onRename(name);
                  setEdit(false);
                }}
                className="text-sm px-2 py-1 rounded bg-slate-900 text-white hover:bg-slate-800 transition"
              >
                Save
              </button>
            </>
          )}

          <button
            onClick={onDelete}
            className="text-sm px-2 py-1 rounded bg-red-50 text-red-700 hover:bg-red-100 transition"
          >
            Delete
          </button>
        </div>
      </div>

      <div className="mt-3 text-xs text-slate-500">
        Updated: {new Date(board.updatedAt).toLocaleString()}
      </div>
    </div>
  );
}
