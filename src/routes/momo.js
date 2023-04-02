import express from "express";
import {
  createOrder,
  deleteAllOrders,
  getOrders,
  markAsDelivered,
} from "../controllers/orderController";
import Authorization from "../middleware/Authorization";
import CartAuth from "../middleware/CartAuth";
import ProductAuth from "../middleware/ProductAuth";

const router = express.Router();

router.get("/", Authorization, ProductAuth, getOrders);
router.post("/", Authorization, CartAuth, createOrder);
router.put("/markAsDelivered/:id", Authorization, ProductAuth, markAsDelivered);
router.delete("/deleteAllOrders", Authorization, ProductAuth, deleteAllOrders);

export default router;
