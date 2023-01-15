import mongoose from "mongoose";
import { USER_ROLES } from "../constants/userRoles";
import { Buyer } from "../entities/buyer";
import { getBuyerByUsername } from "../repositories/buyer";
import { getRoleFromSessionToken } from "../utils/user";
import { createNewUser, loadUserFromSessionToken } from "./user";
import createError from "http-errors";

export const createNewBuyer = (username: string, password: string) => {
  const user = createNewUser(username, password);
  return new Buyer(user, 0, new mongoose.Types.ObjectId().toString());
};

export const loadBuyerFromSessionToken = async (sessionToken: string) => {
  const role = getRoleFromSessionToken(sessionToken);
  const user = await loadUserFromSessionToken(sessionToken);
  let buyer = await getBuyerByUsername(user.username);

  if (role !== USER_ROLES.BUYER || buyer == null) {
    throw createError(401, "Unauthorized");
  }
  return buyer;
};
