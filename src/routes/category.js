import express  from "express"
import Authorization from "../middleware/Authorization";
import AdminAuth from "../middleware/AdminAuth";
import { addCategory, deleteCategory, getAllCategories, updateCategory } from "../controllers/categoryController";


const  router = express.Router();


router.get("/", getAllCategories);
router.post("/", Authorization,AdminAuth,addCategory);
router.put("/:id", Authorization,AdminAuth,updateCategory);
router.delete("/:id", Authorization,AdminAuth,deleteCategory);




export default router