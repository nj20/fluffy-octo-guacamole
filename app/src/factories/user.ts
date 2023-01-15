import { User } from "../entities/user";
import jwt, { Secret } from "jsonwebtoken";
import { getUserById, getUserByUsername } from "../repositories/user";
import createError from "http-errors";
import { isPasswordAcceptable, isUsernameAcceptable } from "../utils/user";
import { v4 as uuid } from "uuid";
import mongoose from "mongoose";

export const createNewUser = (username: string, password: string) => {
  if (!isUsernameAcceptable(username) || !isPasswordAcceptable(password)) {
    throw createError(400, "Bad credentials");
  }
  const user = new User(
    new mongoose.Types.ObjectId().toString(),
    username,
    uuid(),
    ""
  );
  user.setPassword(password);
  return user;
};

export const loadUserFromSessionToken = async (sessionToken: string) => {
  const { userId } = jwt.verify(
    sessionToken,
    process.env.JWT_SECRET as Secret
  ) as {
    userId: string;
  };
  const user = await getUserById(userId);
  if (user === null) {
    throw createError(401, "Unauthorized");
  }
  return user;
};
