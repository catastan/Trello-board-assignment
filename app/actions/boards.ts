"use server";

import connectMongo from "@/db/mongoose";
import Board from "@/model/board";
import List from "@/model/list";
import Card from "@/model/card";
import { Types } from "mongoose";

export type BoardDTO = {
  _id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
};

function toBoardDTO(b: any): BoardDTO {
  return {
    _id: b._id.toString(),
    name: b.name,
    createdAt: new Date(b.createdAt).toISOString(),
    updatedAt: new Date(b.updatedAt).toISOString(),
  };
}

export async function getBoards(): Promise<BoardDTO[]> {
  await connectMongo();
  const boards = await Board.find({}).sort({ updatedAt: -1 }).lean();
  return boards.map(toBoardDTO);
}

export async function createBoard(name: string) {
  await connectMongo();
  const trimmed = name.trim();
  if (!trimmed) return;

  const b = await Board.create({ _id: new Types.ObjectId(), name: trimmed });
  return toBoardDTO(b);
}

export async function renameBoard(boardId: string, name: string) {
  await connectMongo();
  const trimmed = name.trim();
  if (!trimmed) return;

  await Board.updateOne({ _id: boardId }, { name: trimmed });
}

export async function deleteBoard(boardId: string) {
  await connectMongo();

  const lists = await List.find({ boardId }).lean();
  const listIds = lists.map((l: any) => l._id);

  if (listIds.length > 0) {
    await Card.deleteMany({ listId: { $in: listIds } });
    await List.deleteMany({ _id: { $in: listIds } });
  }

  await Board.deleteOne({ _id: boardId });
}
