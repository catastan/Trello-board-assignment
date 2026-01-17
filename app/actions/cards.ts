"use server";

import connectMongo from "@/db/mongoose";
import Card from "@/model/card";
import Board from "@/model/board";
import List from "@/model/list";
import { Types } from "mongoose";
import type { ListDTO } from "./lists";

/* =======================
   DTO TYPES
======================= */

export type CardDTO = {
  _id: string;
  listId: string;
  title: string;
  description: string;
  createdAt: string;
  updatedAt: string;
};

export type BoardDataDTO = {
  board: { _id: string; name: string } | null;
  lists: ListDTO[];
  cardsByList: Record<string, CardDTO[]>;
};

/* =======================
   HELPERS
======================= */

function toCardDTO(c: any): CardDTO {
  return {
    _id: c._id.toString(),
    listId: c.listId.toString(),
    title: c.title,
    description: c.description ?? "",
    createdAt: new Date(c.createdAt).toISOString(),
    updatedAt: new Date(c.updatedAt).toISOString(),
  };
}

/* =======================
   CARD ACTIONS
======================= */

export async function createCard(listId: string, title: string) {
  await connectMongo();

  const trimmed = title.trim();
  if (!trimmed) return;

  const card = await Card.create({
    _id: new Types.ObjectId(),
    listId: new Types.ObjectId(listId),
    title: trimmed,
    description: "",
  });

  return toCardDTO(card);
}

export async function updateCard(
  cardId: string,
  patch: { title?: string; description?: string },
) {
  await connectMongo();

  const update: any = {};

  if (typeof patch.title === "string") {
    const t = patch.title.trim();
    if (t) update.title = t;
  }

  if (typeof patch.description === "string") {
    update.description = patch.description;
  }

  if (Object.keys(update).length === 0) return;

  await Card.updateOne({ _id: cardId }, update);
}

export async function deleteCard(cardId: string) {
  await connectMongo();
  await Card.deleteOne({ _id: cardId });
}

/* =======================
   FETCHING DATA
======================= */

export async function getCardsByBoard(boardId: string): Promise<CardDTO[]> {
  await connectMongo();

  const lists = await List.find({ boardId }).lean();
  const listIds = lists.map((l: any) => l._id);

  if (listIds.length === 0) return [];

  const cards = await Card.find({ listId: { $in: listIds } })
    .sort({ createdAt: 1 })
    .lean();

  return cards.map(toCardDTO);
}

export async function getBoardData(boardId: string): Promise<BoardDataDTO> {
  await connectMongo();

  const board = (await Board.findById(boardId).lean()) as {
    _id: Types.ObjectId;
    name: string;
  } | null;

  const listsRaw = await List.find({ boardId }).sort({ createdAt: 1 }).lean();

  const lists: ListDTO[] = listsRaw.map((l: any) => ({
    _id: l._id.toString(),
    boardId: l.boardId.toString(),
    name: l.name,
    createdAt: new Date(l.createdAt).toISOString(),
    updatedAt: new Date(l.updatedAt).toISOString(),
  }));

  const listIds = listsRaw.map((l: any) => l._id);

  const cardsRaw =
    listIds.length > 0
      ? await Card.find({ listId: { $in: listIds } })
          .sort({ createdAt: 1 })
          .lean()
      : [];

  const cardsByList: Record<string, CardDTO[]> = {};
  for (const l of lists) cardsByList[l._id] = [];

  for (const c of cardsRaw) {
    const dto = toCardDTO(c);
    cardsByList[dto.listId].push(dto);
  }

  return {
    board: board ? { _id: board._id.toString(), name: board.name } : null,
    lists,
    cardsByList,
  };
}
