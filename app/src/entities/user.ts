import sha256 from "crypto-js/sha256";
import jwt, { Secret } from "jsonwebtoken";
import createError from "http-errors";

export class User {
  username: string;
  salt: string;
  passwordHash: string;

  constructor(username: string, salt: string, passwordHash: string = "") {
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
        username: this.username,
        claims,
      },
      process.env.JWT_SECRET as Secret
    );
  }

  setPassword(password: string) {
    if (!this.salt) {
      throw new Error("Salt is not set yet");
    }
    this.passwordHash = sha256(this.salt + password).toString();
  }

  toJSON() {
    return {
      username: this.username,
    };
  }
}
