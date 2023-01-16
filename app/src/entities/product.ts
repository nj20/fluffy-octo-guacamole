import { Seller } from "./seller";
import { isValidProductCost } from "../utils/product";
import createError from "http-errors";

export class Product {
  productId: string;
  seller: Seller;
  productName: string;
  #cost: number;
  amountAvailable: number;

  constructor(
    productId: string,
    seller: Seller,
    productName: string,
    cost: number,
    amountAvailable: number
  ) {
    if (!isValidProductCost(cost)) {
      throw createError.BadRequest(
        "Invalid product cost. Cost must be greater than 0 and a multiple of 5"
      );
    }
    if (productName.length === 0) {
      throw createError.BadRequest("Product name cannot be empty");
    }
    this.productId = productId;
    this.seller = seller;
    this.productName = productName;
    this.#cost = cost;
    this.amountAvailable = amountAvailable;
  }

  setCost(cost: number) {
    if (!isValidProductCost(cost)) {
      throw createError.BadRequest(
        "Invalid product cost. Cost must be greater than 0 and a multiple of 5"
      );
    }
    this.#cost = cost;
  }

  getCost() {
    return this.#cost;
  }

  toJSON() {
    return {
      productId: this.productId,
      sellerId: this.seller.sellerId,
      productName: this.productName,
      cost: this.#cost,
      amountAvailable: this.amountAvailable,
    };
  }
}
