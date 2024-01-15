import { Router, json } from "express";
import { db } from "../utils/db.js";
import { ObjectId } from "mongodb";

const productRouter = Router();

productRouter.get("/", async (req, res) => {
  const collection = db.collection("products");

  const category = req.query.category;
  const keywords = req.query.keywords;

  const query = {};

  if (category) {
    query.category = category;
  }

  if (keywords) {
    query.name = new RegExp(keywords, "i");
  }

  const products = await collection
    .find(query)
    .limit(10)
    .sort({ createdTime: -1 })
    .toArray();

  return res.json({
    data: products,
  });
});

productRouter.get("/:id", async (req, res) => {
  const collection = db.collection("products");
  const productId = new ObjectId(req.params.id);

  const productData = await collection.find({ _id: productId }).toArray();

  return res.json({
    data: productData[0],
  });
});

productRouter.post("/", async (req, res) => {
  const collection = db.collection("products");

  const productData = { ...req.body };
  productData.createdTime = new Date();
  const products = await collection.insertOne(productData);

  return res.json({
    message: "Product has been created successfully",
  });
});

productRouter.put("/:id", async (req, res) => {
  const collection = db.collection("products");
  const productId = new ObjectId(req.params.id);

  const productData = { ...req.body };
  await collection.updateOne(
    {
      _id: productId,
    },
    {
      $set: productData,
    }
  );

  return res.json({
    message: "Product has been updated successfully",
  });
});

productRouter.delete("/:id", async (req, res) => {
  const collection = db.collection("products");

  const productId = new ObjectId(req.params.id);
  const deleteProduct = await collection.deleteOne({ _id: productId });

  return res.json({
    message: "Product has been deleted successfully",
  });
});

export default productRouter;
