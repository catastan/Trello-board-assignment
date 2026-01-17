"use server";

import connectMongo from "@/db/mongoose";
import List from "@/model/list";
import Card from "@/model/card";
import { Types } from "mongoose";

export type ListDTO = {
  _id: string;
  boardId: string;
  name: string;
  createdAt: string;
  updatedAt: string;
};

function toListDTO(l: any): ListDTO {
  return {
    _id: l._id.toString(),
    boardId: l.boardId.toString(),
    name: l.name,
    createdAt: new Date(l.createdAt).toISOString(),
    updatedAt: new Date(l.updatedAt).toISOString(),
  };
}

export async function getLists(boardId: string): Promise<ListDTO[]> {
  await connectMongo();
  const lists = await List.find({ boardId }).sort({ createdAt: 1 }).lean();
  return lists.map(toListDTO);
}

export async function createList(boardId: string, name: string) {
  await connectMongo();
  const trimmed = name.trim();
  if (!trimmed) return;

  const l = await List.create({
    _id: new Types.ObjectId(),
    boardId: new Types.ObjectId(boardId),
    name: trimmed,
  });

  return toListDTO(l);
}

export async function renameList(listId: string, name: string) {
  await connectMongo();
  const trimmed = name.trim();
  if (!trimmed) return;

  await List.updateOne({ _id: listId }, { name: trimmed });
}

export async function deleteList(listId: string) {
  await connectMongo();
  await Card.deleteMany({ listId });
  await List.deleteOne({ _id: listId });
}
