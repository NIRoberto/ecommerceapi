import express from "express";
import {
  login,
  signup,
  getAll,
  deleteAllUsers,
} from "../controllers/usersController";

const router = express.Router();

router.get("/users", getAll);
router.post("/user/login", login);
router.post("/user/register", signup);
router.delete("/users/deleteAll", deleteAllUsers);

export default router;
