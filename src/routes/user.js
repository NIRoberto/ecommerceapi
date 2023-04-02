import express from "express";
import {
  login,
  signup,
  getAll,
  deleteAllUsers,
  updateOneUser,
  getOneUser,
} from "../controllers/usersController";

const router = express.Router();

router.get("/", getAll);
router.post("/login", login);
router.post("/register", signup);
router.delete("/deleteAll", deleteAllUsers);
router.get("/:id", getOneUser);
router.put("/:id", updateOneUser);

export default router;
