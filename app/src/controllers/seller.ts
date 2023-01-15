import { Seller } from "../entities/seller";
import createError from "http-errors";
import {
  addSeller as addSellerToDb,
  doesSellerExistWithUsername,
  getSellerById,
  getSellerByUsername,
  updateSeller as updateSellerInDb,
} from "../repositories/seller";
import { createNewSeller } from "../factories/seller";

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
  sellerId: string,
  updatedUserName: string,
  updatedPassword: string
) => {
  const seller = await getSellerById(sellerId);
  if (seller == null) {
    throw createError(404, "Seller not found");
  }

  seller.user.username = updatedUserName;
  seller.user.setPassword(updatedPassword);

  await updateSellerInDb(seller);

  return seller;
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
