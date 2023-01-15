import { UserModel, UserSchema } from "../db/schemas/user";
import { User } from "../entities/user";
import { HydratedDocument } from "mongoose";

export const addUser = async (user: User): Promise<User> => {
  const userDoc = new UserModel({
    username: user.username,
    salt: user.salt,
    passwordHash: user.passwordHash,
  });
  await userDoc.save();
  return user;
};

export const getUserByUsername = async (
  username: string
): Promise<User | null> => {
  const userDoc = await UserModel.findOne({
    username,
  });
  return userDoc === null ? null : instantiateUserFromDoc(userDoc);
};

export const updateUser = async (user: User): Promise<boolean> => {
  const userDoc = await UserModel.updateOne({
    username: user.username,
    salt: user.salt,
    passwordHash: user.passwordHash,
  });
  return userDoc.modifiedCount === 1;
};

export const doesUserExistWithUsername = async (
  username: string
): Promise<boolean> => {
  const user = await getUserByUsername(username);
  return user !== null;
};

const instantiateUserFromDoc = (
  userDoc: HydratedDocument<UserSchema>
): User => {
  return new User(userDoc.username, userDoc.salt, userDoc.passwordHash);
};
