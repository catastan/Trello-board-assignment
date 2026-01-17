import { model, models, Schema, Types } from "mongoose";

export interface CardDoc {
  _id: string;
  listId: string;
  title: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

const CardSchema = new Schema(
  {
    listId: { type: Types.ObjectId, required: true, index: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
  },
  { timestamps: true },
);

const Card = models.Card || model("Card", CardSchema, "Cards");
export default Card;
