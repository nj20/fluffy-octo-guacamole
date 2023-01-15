import express from "express";
import { USER_ROLES } from "../constants/userRoles";
import {
  createSessionTokenForBuyer,
  registerBuyer,
} from "../controllers/buyer";
import {
  createSessionTokenForSeller,
  registerSeller,
} from "../controllers/seller";
var router = express.Router();

router.post("/", async function (req, res, next) {
  try {
    if (req.body.role === USER_ROLES.SELLER) {
      const seller = await registerSeller(req.body.username, req.body.password);
      res.status(201).json(await seller.toJSON());
    } else if (req.body.role === USER_ROLES.BUYER) {
      const buyer = await registerBuyer(req.body.username, req.body.password);
      res.status(201).json(await buyer.toJSON());
    } else {
      res.status(400).json({
        error: "Invalid role",
      });
    }
  } catch (e) {
    next(e);
  }
});

router.post("/:username/session", async function (req, res, next) {
  try {
    if (req.body.role === USER_ROLES.SELLER) {
      const token = await createSessionTokenForSeller(
        req.params.username,
        req.body.password
      );
      res.status(201).json({ token });
    } else if (req.body.role === USER_ROLES.BUYER) {
      const token = await createSessionTokenForBuyer(
        req.params.username,
        req.body.password
      );
      res.status(201).json({ token });
    } else {
      res.status(400).json({
        error: "Invalid role",
      });
    }
  } catch (e) {
    next(e);
  }
});

router.get("/:username", async function (req, res, next) {});

export default router;
