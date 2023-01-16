import mongoose from "mongoose";
import { Product } from "../entities/product";
import { Seller } from "../entities/seller";
import createError from "http-errors";
import { isValidProductCost } from "../utils/product";

export const createNewProduct = (
  productName: string,
  cost: number,
  seller: Seller
) => {
  const productId = new mongoose.Types.ObjectId().toString();
  return new Product(productId, seller, productName, cost, 0);
};
