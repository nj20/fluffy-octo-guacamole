import { HydratedDocument } from "mongoose";
import { ProductModel, ProductSchema } from "../db/schemas/product";
import { Product } from "../entities/product";
import { doesSellerExistWithUsername, getSellerById } from "./seller";
import createError from "http-errors";

export const addProduct = async (product: Product): Promise<Product> => {
  if (!(await doesSellerExistWithUsername(product.seller.user.username))) {
    throw createError(400, "Seller does not exist");
  }
  const productDoc = new ProductModel({
    _id: product.productId,
    sellerId: product.seller.sellerId,
    productName: product.productName,
    cost: product.getCost(),
    amountAvailable: product.amountAvailable,
  });
  await productDoc.save();
  return product;
};

export const updateProduct = async (product: Product): Promise<boolean> => {
  const update = await ProductModel.updateOne(
    {
      _id: product.productId,
    },
    {
      sellerId: product.seller.sellerId,
      productName: product.productName,
      cost: product.getCost(),
      amountAvailable: product.amountAvailable,
    }
  );
  return update.modifiedCount === 1;
};

export const getAllProducts = async () => {
  const productDocs = await ProductModel.find();
  return await Promise.all(productDocs.map(instantiateProductFromDoc));
};

export const getAllProductsByIds = async (
  productIds: string[]
): Promise<Product[]> => {
  const productDocs = await ProductModel.find({
    _id: {
      $in: productIds,
    },
  });
  if (productDocs.length !== productIds.length) {
    throw createError.NotFound("Product not found");
  }
  return await Promise.all(productDocs.map(instantiateProductFromDoc));
};

export const getProductsForSeller = async (sellerId: string) => {
  const productDocs = await ProductModel.find({
    sellerId: sellerId,
  });
  return await Promise.all(productDocs.map(instantiateProductFromDoc));
};

export const deleteProduct = async (product: Product): Promise<boolean> => {
  const deleteResult = await ProductModel.deleteOne({
    _id: product.productId,
  });
  return deleteResult.deletedCount === 1;
};

export const getProductById = async (
  productId: string
): Promise<Product | null> => {
  const productDoc = await ProductModel.findOne({
    _id: productId,
  });
  return productDoc === null
    ? null
    : await instantiateProductFromDoc(productDoc);
};

export const instantiateProductFromDoc = async (
  doc: HydratedDocument<ProductSchema>
): Promise<Product> => {
  const seller = await getSellerById(doc.sellerId.toString());
  if (seller == null) {
    throw createError.NotFound("Seller not found");
  }
  const product = new Product(
    doc.id,
    seller,
    doc.productName,
    doc.cost,
    doc.amountAvailable
  );
  return product;
};
