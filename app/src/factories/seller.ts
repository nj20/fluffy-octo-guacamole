import mongoose from "mongoose";
import { USER_ROLES } from "../constants/userRoles";
import { Seller } from "../entities/seller";
import { getSellerByUsername } from "../repositories/seller";
import { getRoleFromSessionToken } from "../utils/user";
import { createNewUser, loadUserFromSessionToken } from "./user";
import createError from "http-errors";
import { v4 as uuid } from "uuid";

export const createNewSeller = (username: string, password: string) => {
  const user = createNewUser(username, password);
  return new Seller(user, new mongoose.Types.ObjectId().toString());
};

export const loadSellerFromSessionToken = async (sessionToken: string) => {
  const role = getRoleFromSessionToken(sessionToken);
  const user = await loadUserFromSessionToken(sessionToken);
  let seller = await getSellerByUsername(user.username);
  if (role !== USER_ROLES.SELLER || seller == null) {
    throw createError(401, "Unauthorized");
  }
  return seller;
};
