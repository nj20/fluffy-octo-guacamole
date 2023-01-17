import createError from "http-errors";
import {
  addBuyer as addBuyerToDb,
  doesBuyerExistWithUsername,
  getBuyerById,
  getBuyerByUsername,
  updateBuyer as updateBuyerInDb,
  deleteBuyer as deleteBuyerInDb,
} from "../repositories/buyer";
import { Buyer } from "../entities/buyer";
import { isPasswordAcceptable, isUsernameAcceptable } from "../utils/user";
import { createNewBuyer } from "../factories/buyer";
import {
  getAllProductsByIds,
  updateProduct as updateProductInDb,
} from "../repositories/product";
import { Product } from "../entities/product";
import { convertToChange } from "../utils/coins";
import { COIN_AMOUNTS } from "../constants/coins";

type PurchaseRequest = { [productId: string]: number };

export const registerBuyer = async (
  username: string,
  password: string
): Promise<Buyer> => {
  if (await doesBuyerExistWithUsername(username)) {
    throw createError(400, "User already exists");
  }

  const seller = createNewBuyer(username, password);
  await addBuyerToDb(seller);

  return seller;
};

export const getBuyer = async (username: string) => {
  const buyer = await getBuyerByUsername(username);
  if (buyer == null) {
    throw createError(404, "Buyer not found");
  }
  return buyer;
};

export const updateBuyer = async (
  buyer: Buyer,
  updatedUserName: string,
  updatedPassword: string
) => {
  buyer.user.setUsername(updatedUserName);
  buyer.user.setPassword(updatedPassword);
  await updateBuyerInDb(buyer);
  return buyer;
};

export const deleteBuyer = async (buyer: Buyer) => {
  if (buyer.deposit > 0) {
    throw createError(400, "Buyer has money");
  }
  await deleteBuyerInDb(buyer);
};

export const purchaseProducts = async (
  buyer: Buyer,
  purchaseRequest: PurchaseRequest
) => {
  const products = await getAllProductsByIds(Object.keys(purchaseRequest));

  if (!hasEnoughProducts(products, purchaseRequest)) {
    throw createError(400, "Not enough product available");
  }

  const totalCost = totalProductsCost(products, purchaseRequest);
  if (buyer.deposit < totalCost) {
    throw createError(400, "Not enough money");
  }

  //Normally, I would type this as a Receipt, but just saving time
  const receipts: any = [];
  //Ideally this would be atomic, but for simplicity, I'm not doing that
  await Promise.all(
    products.map(async (product) => {
      receipts.push(
        buyer.purchaseProduct(product, purchaseRequest[product.productId])
      );
      await updateProductInDb(product);
    })
  );
  await updateBuyerInDb(buyer);

  //Generating Receipt
  const totalSpend = receipts.reduce(
    //Normally, I would type this as a Receipt, but just saving time
    (total: number, receipt: any) => total + receipt.spent,
    0
  );
  const finalReceipt = {
    purchases: receipts,
    totalSpend,
    changeLeft: convertToChange(buyer.deposit, COIN_AMOUNTS),
  };

  return finalReceipt;
};

export const deposit = async (buyer: Buyer, coins: number[]) => {
  buyer.depositCoins(coins);
  await updateBuyerInDb(buyer);
  return buyer;
};

export const resetDeposit = async (buyer: Buyer) => {
  buyer.deposit = 0;
  await updateBuyerInDb(buyer);
  return buyer;
};

export const createSessionTokenForBuyer = async (
  username: string,
  password: string
) => {
  const buyer = await getBuyerByUsername(username);
  if (buyer == null) {
    throw createError(401, "Unauthorized");
  }
  return await buyer.getSessionToken(password);
};

export const hasEnoughProducts = (
  products: Product[],
  purchaseRequest: PurchaseRequest
) =>
  products.every(
    (product) => product.amountAvailable >= purchaseRequest[product.productId]
  );

export const totalProductsCost = (
  products: Product[],
  purchaseRequest: PurchaseRequest
) =>
  products.reduce((total, product) => {
    return total + product.getCost() * purchaseRequest[product.productId];
  }, 0);
