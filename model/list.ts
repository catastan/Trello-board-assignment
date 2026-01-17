import { model, models, Schema, Types } from "mongoose";

export interface ListDoc {
  _id: string;
  boardId: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

const ListSchema = new Schema(
  {
    boardId: { type: Types.ObjectId, required: true, index: true },
    name: { type: String, required: true, trim: true },
  },
  { timestamps: true },
);

const List = models.List || model("List", ListSchema, "Lists");
export default List;
