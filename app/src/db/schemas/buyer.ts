import { ObjectID } from "bson";
import mongoose, { InferSchemaType, Schema } from "mongoose";

export const buyerSchema = new Schema(
  {
    buyerId: {
      type: ObjectID,
      required: true,
      unique: true,
      primaryKey: true,
    },
    username: {
      type: String,
      ref: "User",
      required: true,
      unique: true,
    },
    deposit: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  {
    strict: "throw",
  }
);

buyerSchema.index({ username: 1 }, { unique: true });

export type BuyerSchema = InferSchemaType<typeof buyerSchema>;

export const BuyerModel = mongoose.model("Buyer", buyerSchema);
