import express from "express";
import { registerUser, loginUser, getMe } from "../controllers/auth.js";
import { protect } from "../middleware/authM.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/me", protect, getMe);

export default router;