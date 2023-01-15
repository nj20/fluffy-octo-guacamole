import createError from "http-errors";
import {
  addBuyer as addBuyerToDb,
  doesBuyerExistWithUsername,
  getBuyerById,
  getBuyerByUsername,
  updateBuyer as updateBuyerInDb,
} from "../repositories/buyer";
import { Buyer } from "../entities/buyer";
import { isPasswordAcceptable, isUsernameAcceptable } from "../utils/user";
import { createNewBuyer } from "../factories/buyer";

export const registerBuyer = async (
  username: string,
  password: string
): Promise<Buyer> => {
  if (await doesBuyerExistWithUsername(username)) {
    throw createError(400, "User already exists");
  }

  const seller = createNewBuyer(username, password);
  await addBuyerToDb(seller);

  return seller;
};

export const getBuyer = async (username: string) => {
  const buyer = await getBuyerByUsername(username);
  if (buyer == null) {
    throw createError(404, "Buyer not found");
  }
  return buyer;
};

export const updateBuyer = async (
  buyerId: string,
  updatedUserName: string,
  updatedPassword: string
) => {
  const buyer = await getBuyerById(buyerId);
  if (buyer == null) {
    throw createError(404, "Buyer not found");
  }

  buyer.user.username = updatedUserName;
  buyer.user.setPassword(updatedPassword);

  await updateBuyerInDb(buyer);

  return buyer;
};

export const createSessionTokenForBuyer = async (
  username: string,
  password: string
) => {
  const buyer = await getBuyerByUsername(username);
  if (buyer == null) {
    throw createError(401, "Unauthorized");
  }
  return await buyer.getSessionToken(password);
};
