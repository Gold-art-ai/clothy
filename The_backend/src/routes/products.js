import express from "express";
import { protect } from "../middleware/authM.js";
import { listProducts, getProduct,createProduct, updateProduct, deleteProduct } from "../controllers/productsC.js";

const router = express.Router();
router.post("/", protect, createProduct); 
router.put("/:id", protect, updateProduct);
router.delete("/:id", protect, deleteProduct);
router.get("/", listProducts);
router.get("/:id", getProduct);

export default router;