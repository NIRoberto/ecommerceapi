import express from "express";
import {
  login,
  signup,
  getAll,
  deleteAllUsers,
  updateOneUser,
  getOneUser,
  deleteOneUser,
  changeStatusUserToVendor,
  getVendors,
} from "../controllers/usersController";

const router = express.Router();

router.get("/", getAll);
router.post("/login", login);
router.post("/register", signup);
router.delete("/deleteAll", deleteAllUsers);
router.get("/:id", getOneUser);
router.put("/:id", updateOneUser);
router.put("/updateRole/:id", changeStatusUserToVendor);
router.get("/all/vendors", getVendors);
router.delete("/delete/:id", deleteOneUser);

export default router;
