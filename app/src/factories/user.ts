import { User } from "../entities/user";
import jwt, { Secret } from "jsonwebtoken";
import { getUserByUsername } from "../repositories/user";
import createError from "http-errors";
import { isPasswordAcceptable, isUsernameAcceptable } from "../utils/user";
import { v4 as uuid } from "uuid";

export const createNewUser = (username: string, password: string) => {
  if (!isUsernameAcceptable(username) || !isPasswordAcceptable(password)) {
    throw createError(400, "Bad credentials");
  }

  const user = new User(username, uuid());
  user.setPassword(password);
  return user;
};

export const loadUserFromSessionToken = async (sessionToken: string) => {
  const { username } = jwt.verify(
    sessionToken,
    process.env.JWT_SECRET as Secret
  ) as {
    username: string;
  };
  const user = await getUserByUsername(username);
  if (user === null) {
    throw createError(401, "Unauthorized");
  }
  return user;
};
