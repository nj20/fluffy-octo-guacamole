import mongoose from "mongoose";
import { USER_ROLES } from "../constants/userRoles";
import { User } from "./user";

export class Seller {
  user: User;
  sellerId: String;

  constructor(user: User, sellerId: String) {
    this.user = user;
    this.sellerId = sellerId;
  }

  async getSessionToken(password: string) {
    const token = await this.user.getSessionToken(password, {
      role: USER_ROLES.SELLER,
    });
    return token;
  }

  async toJSON() {
    return {
      ...this.user.toJSON(),
      sellerId: this.sellerId,
    };
  }

  generateSellerId() {
    this.sellerId = new mongoose.Types.ObjectId().toString();
  }
}
