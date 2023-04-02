import express from "express";
import {
  getAllProducts,
  getSingleProduct,
  createProduct,
  deleteProduct,
  updateProduct,
  deleteAllProducts,
} from "../controllers/productController";
import Authorization from "../middleware/Authorization";
import ProductAuth from "../middleware/ProductAuth";

const router = express.Router();

// router
//   .route("/", Authorization, ProductAuth)
//   .post(createProduct)
//   .get(getAllProducts);

router.post("/", Authorization, ProductAuth, createProduct);
router.get("/", getAllProducts);
router.get("/:id",getSingleProduct);
router.delete("/delete/:id", Authorization, ProductAuth, deleteProduct);
router.put("/:id", Authorization, ProductAuth, updateProduct);
router.delete("/deleteAll", Authorization, ProductAuth, deleteAllProducts);

// router.route("/product/:id").get().delete();

export default router;
