import express from "express";
import { ProductModel } from "./model.js";

const productsRouter = express.Router();

productsRouter
  .get("/", async (req, res) => {
    const products = await ProductModel.find({});
    res.send(products);
  })
  .post("/", async (req, res) => {
    const product = new ProductModel(req.body);
    await product.save();
    res.status(201).send(product);
  })
  .get("/:id", async (req, res) => {
    try {
      const id = req.params.id;
      const products = await ProductModel.findById(id);
      if (products) {
        res.send(products);
      } else {
        res.status(404).send();
      }
    } catch (error) {
      res.status(404).send();
      console.error(error);
    }
  })
  .delete("/:id", async (req, res) => {
    try {
      const id = req.params.id;
      const products = await ProductModel.findByIdAndDelete(id);
      if (products) {
        res.status(204).send();
      } else {
        res.status(404).send();
      }
    } catch (error) {
      res.status(404).send();
      console.error(error);
    }
  });

export default productsRouter;
