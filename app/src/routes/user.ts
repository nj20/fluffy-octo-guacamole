import "../types/express";
import express, { Request, Response, NextFunction } from "express";

import {
  createSessionTokenForBuyer,
  registerBuyer,
  updateBuyer,
} from "../controllers/buyer";
import {
  createSessionTokenForSeller,
  registerSeller,
  updateSeller,
} from "../controllers/seller";
import { buyerAuthMiddleware, sellerAuthMiddleware } from "../middleware/auth";
import { Seller } from "../entities/seller";
import { Buyer } from "../entities/buyer";
var router = express.Router();

router.post("/seller", async function (req, res, next) {
  try {
    const seller = await registerSeller(req.body.username, req.body.password);
    res.status(201).json(seller.toJSON());
  } catch (e) {
    next(e);
  }
});

router.post("/:username/seller/session", async function (req, res, next) {
  try {
    const token = await createSessionTokenForSeller(
      req.params.username,
      req.body.password
    );
    res.status(201).json({ token });
  } catch (e) {
    next(e);
  }
});

router.get(
  "/seller",
  sellerAuthMiddleware,
  async function (req: Request, res: Response, next: NextFunction) {
    try {
      res.status(200).json(req.user.toJSON());
    } catch (e) {
      next(e);
    }
  }
);

router.patch(
  "/seller",
  sellerAuthMiddleware,
  async function (req: Request, res: Response, next: NextFunction) {
    try {
      const seller = req.user as Seller;
      const updatedSeller = await updateSeller(
        seller.sellerId,
        req.body.username,
        req.body.password
      );
      res.status(200).json(updatedSeller.toJSON());
    } catch (e) {
      next(e);
    }
  }
);

router.post("/buyer", async function (req, res, next) {
  try {
    const buyer = await registerBuyer(req.body.username, req.body.password);
    res.status(201).json(buyer.toJSON());
  } catch (e) {
    next(e);
  }
});

router.post("/:username/buyer/session", async function (req, res, next) {
  try {
    const token = await createSessionTokenForBuyer(
      req.params.username,
      req.body.password
    );
    res.status(201).json({ token });
  } catch (e) {
    next(e);
  }
});

router.get(
  "/buyer",
  buyerAuthMiddleware,
  async function (req: Request, res: Response, next: NextFunction) {
    try {
      res.status(200).json(req.user.toJSON());
    } catch (e) {
      next(e);
    }
  }
);

router.patch(
  "/buyer",
  buyerAuthMiddleware,
  async function (req: Request, res: Response, next: NextFunction) {
    try {
      const buyer = req.user as Buyer;
      const updatedBuyer = await updateBuyer(
        buyer.buyerId,
        req.body.username,
        req.body.password
      );
      res.status(200).json(updatedBuyer.toJSON());
    } catch (e) {
      next(e);
    }
  }
);

export default router;
