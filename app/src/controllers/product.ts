import createHttpError from "http-errors";
import { Seller } from "../entities/seller";
import { createNewProduct } from "../factories/product";
import createError from "http-errors";
import {
  addProduct as addProductToDb,
  getAllProducts as getAllProductsFromDb,
  getProductById,
  updateProduct as updateProductInDb,
  deleteProduct as deleteProductFromDb,
} from "../repositories/product";

export const addNewProduct = async (
  productName: string,
  cost: number,
  seller: Seller
) => {
  const product = createNewProduct(productName, cost, seller);
  await addProductToDb(product);
  return product;
};

export const updateProduct = async (
  productId: string,
  productName: string,
  cost: number,
  amountAvailable: number,
  seller: Seller
) => {
  const product = await getProductById(productId);
  if (product === null) {
    throw createError.NotFound("Product not found");
  }
  if (seller.sellerId !== product.seller.sellerId) {
    throw createError.Forbidden("You are not the owner of this product");
  }
  product.productName = productName;
  product.setCost(cost);
  product.amountAvailable = amountAvailable | 0;

  await updateProductInDb(product);

  return product;
};

export const deleteProduct = async (productId: string, seller: Seller) => {
  const product = await getProductById(productId);
  if (product === null) {
    throw createError.NotFound("Product not found");
  }
  if (seller.sellerId !== product.seller.sellerId) {
    throw createError.Forbidden("You are not the owner of this product");
  }
  await deleteProductFromDb(product);
};

export const getProduct = async (productId: string) => {
  const product = await getProductById(productId);
  if (product === null) {
    throw createError.NotFound("Product not found");
  }
  return product;
};

export const getAllProducts = async () => {
  const products = await getAllProductsFromDb();
  return products;
};
