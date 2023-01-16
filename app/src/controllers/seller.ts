import { Seller } from "../entities/seller";
import createError from "http-errors";
import {
  addSeller as addSellerToDb,
  doesSellerExistWithUsername,
  getSellerById,
  getSellerByUsername,
  updateSeller as updateSellerInDb,
  deleteSeller as deleteSellerFromDb,
} from "../repositories/seller";
import { createNewSeller } from "../factories/seller";
import { getProductsForSeller } from "../repositories/product";

export const registerSeller = async (
  username: string,
  password: string
): Promise<Seller> => {
  if (await doesSellerExistWithUsername(username)) {
    throw createError(400, "User already exists");
  }

  const seller = createNewSeller(username, password);
  await addSellerToDb(seller);

  return seller;
};

export const getSeller = async (username: string) => {
  const seller = await getSellerByUsername(username);
  if (seller == null) {
    throw createError(404, "Seller not found");
  }
  return seller;
};

export const updateSeller = async (
  seller: Seller,
  updatedUserName: string,
  updatedPassword: string
) => {
  seller.user.username = updatedUserName;
  seller.user.setPassword(updatedPassword);
  await updateSellerInDb(seller);
  return seller;
};

export const deleteSeller = async (seller: Seller) => {
  const products = await getProductsForSeller(seller.sellerId);
  if (products.length > 0) {
    throw createError(400, "Seller has products");
  }
  await deleteSellerFromDb(seller);
};

export const createSessionTokenForSeller = async (
  username: string,
  password: string
) => {
  const seller = await getSellerByUsername(username);
  if (seller == null) {
    throw createError(401, "Unauthorized");
  }
  return await seller.getSessionToken(password);
};
