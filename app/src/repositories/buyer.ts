import { BuyerModel, BuyerSchema } from "../db/schemas/buyer";
import createError from "http-errors";
import { addUser, doesUserExistWithUsername, getUserByUsername } from "./user";
import { Buyer } from "../entities/buyer";
import mongoose, { HydratedDocument } from "mongoose";

export const addBuyer = async (buyer: Buyer): Promise<Buyer> => {
  if (
    (await doesBuyerExistWithUsername(buyer.user.username)) ||
    (await doesUserExistWithUsername(buyer.user.username))
  ) {
    throw createError(400, "User already exists");
  }

  const user = await addUser(buyer.user);
  const buyerDoc = new BuyerModel({
    username: user.username,
    buyerId: new mongoose.Types.ObjectId(),
  });
  await buyerDoc.save();
  return buyer;
};

export const doesBuyerExistWithUsername = async (
  username: string
): Promise<boolean> => {
  const buyer = await getBuyerByUsername(username);
  return buyer !== null;
};

export const getBuyerByUsername = async (
  username: string
): Promise<Buyer | null> => {
  const buyerDoc = await BuyerModel.findOne({
    username,
  });
  return buyerDoc == null ? null : await instantiateBuyerFromDoc(buyerDoc);
};

const instantiateBuyerFromDoc = async (
  buyerDoc: HydratedDocument<BuyerSchema>
): Promise<Buyer> => {
  const user = await getUserByUsername(buyerDoc.username);
  if (user === null) {
    throw createError.NotFound("User not found");
  }
  return new Buyer(user, buyerDoc.deposit);
};
