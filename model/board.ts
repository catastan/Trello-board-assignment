import { model, models, Schema } from "mongoose";

export interface BoardDoc {
  _id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

const BoardSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
  },
  { timestamps: true },
);

const Board = models.Board || model("Board", BoardSchema, "Boards");
export default Board;
