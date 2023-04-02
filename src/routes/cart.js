import express from "express";
import {
  AddToCart,
  getAllCarts,
  removeFromCart,
  getSingleCart,
  deleteAllCarts,
//   updateCart,
} from "../controllers/cartController";
import Authorization from "../middleware/Authorization";
import CartAuth from "../middleware/CartAuth";

const router = express.Router();

// router
//   .route("/", Authorization, ProductAuth)
//   .post(createProduct)
//   .get(getAllProducts);

router.post("/:id", Authorization, CartAuth, AddToCart);
router.get("/", getAllCarts);
router.get("/:id", getSingleCart);
router.delete("/delete/:id", Authorization, CartAuth, removeFromCart);
// router.put("/:id", Authorization, CartAuth, updateCart);
router.delete("/deleteAll", Authorization, CartAuth, deleteAllCarts);

// router.route("/product/:id").get().delete();

export default router;
