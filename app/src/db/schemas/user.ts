import mongoose, { InferSchemaType, Schema } from "mongoose";

export const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      primaryKey: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
    salt: {
      type: String,
      required: true,
    },
  },
  {
    strict: "throw",
  }
);

export type UserSchema = InferSchemaType<typeof userSchema>;

export const UserModel = mongoose.model("User", userSchema);
