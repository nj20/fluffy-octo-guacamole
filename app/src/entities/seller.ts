import mongoose from "mongoose";
import { USER_ROLES } from "../constants/userRoles";
import { User } from "./user";

export class Seller {
  user: User;
  sellerId: string;

  constructor(user: User, sellerId: string) {
    this.user = user;
    this.sellerId = sellerId;
  }

  async getSessionToken(password: string) {
    const token = await this.user.getSessionToken(password, {
      role: USER_ROLES.SELLER,
    });
    return token;
  }

  toJSON() {
    return {
      ...this.user.toJSON(),
      sellerId: this.sellerId,
    };
  }

  generateSellerId() {
    this.sellerId = new mongoose.Types.ObjectId().toString();
  }
}
