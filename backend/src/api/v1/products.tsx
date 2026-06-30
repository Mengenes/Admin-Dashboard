import express from "express";
import {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct
} from "../../handlers/products";
import { routeAuth } from "../../middlewares/routeAuth";
import { ordersAuth } from "../../middlewares/ordersAuth";

const router = express.Router();

router.post("/",routeAuth,ordersAuth, createProduct);
router.get("/",routeAuth,ordersAuth, getProducts);

router.get("/:id",routeAuth,ordersAuth, getProductById);

router.patch("/:id",routeAuth,ordersAuth, updateProduct);
router.delete("/:id",routeAuth,ordersAuth, deleteProduct);

export default router;