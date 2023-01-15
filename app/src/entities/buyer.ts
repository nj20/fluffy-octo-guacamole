import { USER_ROLES } from "../constants/userRoles";
import { User } from "./user";

export class Buyer {
  user: User;
  deposit: number;

  constructor(user: User, deposit: number) {
    this.user = user;
    this.deposit = deposit;
  }

  async getSessionToken(password: string) {
    const token = await this.user.getSessionToken(password, {
      role: USER_ROLES.BUYER,
    });
    return token;
  }

  async toJSON() {
    return {
      ...this.user.toJSON(),
    };
  }
}
