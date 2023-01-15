import { Request, Response, NextFunction } from "express";
import { loadSellerFromSessionToken } from "../factories/seller";
import { loadBuyerFromSessionToken } from "../factories/buyer";

export const sellerAuthMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.token) {
      res.sendStatus(401);
      return;
    }
    const seller = await loadSellerFromSessionToken(req.token);
    if (!seller) {
      res.sendStatus(401);
      return;
    }
    req.user = seller;
    next();
  } catch (e) {
    console.log(e);
    res.sendStatus(401);
    return;
  }
};

export const buyerAuthMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.token) {
      res.sendStatus(401);
      return;
    }
    const buyer = await loadBuyerFromSessionToken(req.token);
    if (!buyer) {
      res.sendStatus(401);
      return;
    }
    req.user = buyer;
    next();
  } catch (e) {
    console.log(e);
    res.sendStatus(401);
    return;
  }
};
