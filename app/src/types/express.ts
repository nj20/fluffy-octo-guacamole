import "express-bearer-token";
import { Buyer } from "../entities/buyer";
import { Seller } from "../entities/seller";

declare global {
  namespace Express {
    export interface Request {
      user: Seller | Buyer;
    }
  }
}

export {};
