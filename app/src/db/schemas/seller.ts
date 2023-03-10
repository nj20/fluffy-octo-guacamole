import { ObjectID } from "bson";
import mongoose, { InferSchemaType, Schema } from "mongoose";

export const sellerSchema = new Schema(
  {
    sellerId: {
      type: ObjectID,
      required: true,
      unique: true,
      primaryKey: true,
    },
    userId: {
      type: String,
      ref: "User",
      required: true,
      unique: true,
    },
  },
  {
    strict: "throw",
  }
);

sellerSchema.index({ userId: 1 }, { unique: true });

export type SellerSchema = InferSchemaType<typeof sellerSchema>;

export const SellerModel = mongoose.model("Seller", sellerSchema);
