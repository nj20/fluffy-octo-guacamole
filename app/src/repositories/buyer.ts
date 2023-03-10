import { BuyerModel, BuyerSchema } from "../db/schemas/buyer";
import createError from "http-errors";
import {
  addUser,
  deleteUser,
  doesUserExistWithUsername,
  getUserById,
  getUserByUsername,
  updateUser,
} from "./user";
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
    userId: user.userId,
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
  const user = await getUserByUsername(username);
  const buyerDoc = await BuyerModel.findOne({
    userId: user?.userId,
  });
  return buyerDoc == null ? null : await instantiateBuyerFromDoc(buyerDoc);
};

export const getBuyerById = async (buyerId: string): Promise<Buyer | null> => {
  const buyerDoc = await BuyerModel.findOne({
    buyerId: buyerId,
  });
  return buyerDoc == null ? null : await instantiateBuyerFromDoc(buyerDoc);
};

export const updateBuyer = async (buyer: Buyer): Promise<boolean> => {
  await updateUser(buyer.user);
  const update = await BuyerModel.updateOne(
    {
      buyerId: buyer.buyerId,
    },
    {
      buyerId: buyer.buyerId,
      userId: buyer.user.userId,
      deposit: buyer.deposit,
    }
  );
  return update.upsertedCount === 1;
};

export const deleteBuyer = async (buyer: Buyer): Promise<boolean> => {
  await deleteUser(buyer.user);
  const deleteResult = await BuyerModel.deleteOne({
    buyerId: buyer.buyerId,
  });
  return deleteResult.deletedCount === 1;
};

const instantiateBuyerFromDoc = async (
  buyerDoc: HydratedDocument<BuyerSchema>
): Promise<Buyer> => {
  const user = await getUserById(buyerDoc.userId);
  if (user === null) {
    throw createError.NotFound("User not found");
  }
  return new Buyer(user, buyerDoc.deposit, buyerDoc.buyerId.toString());
};
