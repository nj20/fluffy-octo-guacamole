import { USER_ROLES } from "../constants/userRoles";
import { getProductById, updateProduct } from "../repositories/product";
import { convertToChange, isValidCoin } from "../utils/coins";
import { User } from "./user";
import createError from "http-errors";
import { COIN_AMOUNTS } from "../constants/coins";
import { Product } from "./product";

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

  depositCoins(coins: number[]) {
    if (!coins.every(isValidCoin)) throw createError.BadRequest("Invalid coin");
    this.deposit += coins.reduce((a, b) => a + b, 0);
  }

  /*
   * NOTE: This method is not atomic. It is possible that the product is sold out
   * between the time the product is retrieved and the time the product is
   * updated. This is a tradeoff for simplicity.
   */
  purchaseProduct(product: Product, amount: number) {
    if (product === null) throw createError.NotFound("Product not found");
    if (product.amountAvailable < amount)
      throw createError.BadRequest("Not enough product available");

    const totalCost = product.getCost() * amount;
    if (this.deposit < totalCost)
      throw createError.BadRequest("Not enough deposit");

    product.amountAvailable -= amount;
    this.deposit -= totalCost;

    return {
      product: product.productName,
      amountOfProducts: amount,
      spent: totalCost,
    };
  }

  toJSON() {
    return {
      ...this.user.toJSON(),
      deposit: this.deposit,
    };
  }
}
