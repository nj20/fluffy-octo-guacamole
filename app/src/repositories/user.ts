import { UserModel, UserSchema } from "../db/schemas/user";
import { User } from "../entities/user";
import { HydratedDocument } from "mongoose";
import createError from "http-errors";

export const addUser = async (user: User): Promise<User> => {
  const userDoc = new UserModel({
    _id: user.userId,
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

export const getUserById = async (userId: string): Promise<User | null> => {
  const userDoc = await UserModel.findOne({
    _id: userId,
  });
  return userDoc === null ? null : instantiateUserFromDoc(userDoc);
};

export const updateUser = async (user: User): Promise<boolean> => {
  try {
    const update = await UserModel.updateOne(
      {
        _id: user.userId,
      },
      {
        username: user.username,
        salt: user.salt,
        passwordHash: user.passwordHash,
      }
    );
    return update.modifiedCount === 1;
  } catch (e: any) {
    if (e.code === 11000) {
      throw createError.BadRequest("User already exists");
    }
    return false;
  }
};

export const deleteUser = async (user: User): Promise<boolean> => {
  const deleteResult = await UserModel.deleteOne({
    _id: user.userId,
  });
  return deleteResult.deletedCount === 1;
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
  return new User(
    userDoc.id,
    userDoc.username,
    userDoc.salt,
    userDoc.passwordHash
  );
};
