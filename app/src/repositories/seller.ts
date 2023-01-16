import { SellerModel, SellerSchema } from "../db/schemas/seller";
import createError from "http-errors";
import {
  addUser,
  deleteUser,
  doesUserExistWithUsername,
  getUserById,
  getUserByUsername,
  updateUser,
} from "./user";
import { Seller } from "../entities/seller";
import { HydratedDocument } from "mongoose";

export const addSeller = async (seller: Seller): Promise<Seller> => {
  if (
    (await doesSellerExistWithUsername(seller.user.username)) ||
    (await doesUserExistWithUsername(seller.user.username))
  ) {
    throw createError(400, "User already exists");
  }

  const user = await addUser(seller.user);
  const sellerDoc = new SellerModel({
    userId: user.userId,
    sellerId: seller.sellerId,
  });
  await sellerDoc.save();
  return seller;
};

export const doesSellerExistWithUsername = async (
  username: string
): Promise<boolean> => {
  const seller = await getSellerByUsername(username);
  return seller !== null;
};

export const getSellerByUsername = async (
  username: string
): Promise<Seller | null> => {
  const user = await getUserByUsername(username);
  const sellerDoc = await SellerModel.findOne({
    userId: user?.userId,
  });
  return sellerDoc == null ? null : await instantiateSellerFromDoc(sellerDoc);
};

export const getSellerById = async (
  sellerId: string
): Promise<Seller | null> => {
  const sellerDoc = await SellerModel.findOne({
    sellerId: sellerId,
  });
  return sellerDoc == null ? null : await instantiateSellerFromDoc(sellerDoc);
};

export const updateSeller = async (seller: Seller): Promise<boolean> => {
  await updateUser(seller.user);
  const update = await SellerModel.updateOne(
    {
      sellerId: seller.sellerId,
    },
    {
      sellerId: seller.sellerId,
      userId: seller.user.userId,
    }
  );
  return update.upsertedCount === 1;
};

export const deleteSeller = async (seller: Seller): Promise<boolean> => {
  await deleteUser(seller.user);
  const deleteResult = await SellerModel.deleteOne({
    sellerId: seller.sellerId,
  });
  return deleteResult.deletedCount === 1;
};

const instantiateSellerFromDoc = async (
  sellerDoc: HydratedDocument<SellerSchema>
): Promise<Seller> => {
  const user = await getUserById(sellerDoc.userId);
  if (user === null) {
    throw createError.NotFound("User not found");
  }
  return new Seller(user, sellerDoc.sellerId.toString());
};
