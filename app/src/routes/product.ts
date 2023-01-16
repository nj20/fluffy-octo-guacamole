import express from "express";
var router = express.Router();
import { sellerAuthMiddleware } from "../middleware/auth";
import { Seller } from "../entities/seller";
import {
  addNewProduct,
  deleteProduct,
  getAllProducts,
  getProduct,
  updateProduct,
} from "../controllers/product";

router.post("/", sellerAuthMiddleware, async function (req, res, next) {
  try {
    const seller = req.user as Seller;
    const product = await addNewProduct(
      req.body.productName,
      req.body.cost,
      seller
    );
    res.json(product.toJSON()).status(201);
  } catch (e) {
    next(e);
  }
});

router.patch(
  "/:productId",
  sellerAuthMiddleware,
  async function (req, res, next) {
    try {
      const seller = req.user as Seller;
      const product = await updateProduct(
        req.params.productId,
        req.body.productName,
        req.body.cost,
        req.body.amountAvailable,
        seller
      );
      res.json(product.toJSON()).status(201);
    } catch (e) {
      next(e);
    }
  }
);

router.get("/:productId", async function (req, res, next) {
  try {
    const product = await getProduct(req.params.productId);
    res.json(product.toJSON()).status(200);
  } catch (e) {
    next(e);
  }
});

router.delete(
  "/:productId",
  sellerAuthMiddleware,
  async function (req, res, next) {
    try {
      await deleteProduct(req.params.productId, req.user as Seller);
      res.json().status(204);
    } catch (e) {
      next(e);
    }
  }
);

router.get("/", async function (req, res, next) {
  try {
    const product = await getAllProducts();
    res.json(product.map((p) => p.toJSON())).status(200);
  } catch (e) {
    next(e);
  }
});

export default router;
