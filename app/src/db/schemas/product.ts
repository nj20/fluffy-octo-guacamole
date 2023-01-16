import mongoose, { InferSchemaType, Schema } from "mongoose";
import { ObjectID } from "bson";

export const productSchema = new Schema(
  {
    productName: {
      type: String,
      required: true,
    },
    cost: {
      type: Number,
      required: true,
    },
    amountAvailable: {
      type: Number,
      required: true,
    },
    sellerId: {
      type: ObjectID,
      required: true,
      ref: "Seller",
    },
  },
  {
    strict: "throw",
  }
);

productSchema.index({ sellerId: 1 }, { unique: false });

export type ProductSchema = InferSchemaType<typeof productSchema>;

export const ProductModel = mongoose.model("Product", productSchema);
