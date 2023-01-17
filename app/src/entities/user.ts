import sha256 from "crypto-js/sha256";
import jwt, { Secret } from "jsonwebtoken";
import createError from "http-errors";
import { isPasswordAcceptable, isUsernameAcceptable } from "../utils/user";

export class User {
  userId: string;
  username: string;
  salt: string;
  passwordHash: string;

  constructor(
    userId: string,
    username: string,
    salt: string,
    passwordHash: string
  ) {
    this.userId = userId;
    this.username = username;
    this.salt = salt;
    this.passwordHash = passwordHash;
  }

  async getSessionToken(password: string, claims?: any) {
    const expectedPasswordHash = sha256(this.salt + password).toString();
    if (expectedPasswordHash !== this.passwordHash) {
      throw createError(401, "Unauthorized");
    }

    return jwt.sign(
      {
        userId: this.userId,
        claims,
      },
      process.env.JWT_SECRET as Secret
    );
  }

  setUsername(username: string) {
    if (!isUsernameAcceptable(username)) {
      throw createError(400, "Username is not acceptable");
    }
    this.username = username;
  }

  setPassword(password: string) {
    if (!this.salt) {
      throw new Error("Salt is not set yet");
    }
    if (!isPasswordAcceptable(password)) {
      throw createError(400, "Password is not acceptable");
    }
    this.passwordHash = sha256(this.salt + password).toString();
  }

  toJSON() {
    return {
      username: this.username,
    };
  }
}
