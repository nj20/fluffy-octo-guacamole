import { SellerModel, SellerSchema } from "../db/schemas/seller";
import createError from "http-errors";
import { addUser, doesUserExistWithUsername, getUserByUsername } from "./user";
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
    username: user.username,
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
  const sellerDoc = await SellerModel.findOne({
    username,
  });
  return sellerDoc == null ? null : await instantiateSellerFromDoc(sellerDoc);
};

const instantiateSellerFromDoc = async (
  sellerDoc: HydratedDocument<SellerSchema>
): Promise<Seller> => {
  const user = await getUserByUsername(sellerDoc.username);
  if (user === null) {
    throw createError.NotFound("User not found");
  }
  return new Seller(user, sellerDoc.id);
};
