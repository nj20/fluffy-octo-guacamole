import { USER_ROLES } from "../constants/userRoles";
import { User } from "./user";

export class Buyer {
  user: User;
  deposit: number;
  buyerId: string;

  constructor(user: User, deposit: number, buyerId: string) {
    this.user = user;
    this.deposit = deposit;
    this.buyerId = buyerId;
  }

  async getSessionToken(password: string) {
    const token = await this.user.getSessionToken(password, {
      role: USER_ROLES.BUYER,
    });
    return token;
  }

  toJSON() {
    return {
      ...this.user.toJSON(),
    };
  }
}
