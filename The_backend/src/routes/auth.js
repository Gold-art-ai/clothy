import express from "express";
// Controller file: ../controllers/authC.js — exports registerUser, loginUser, getMe
import { registerUser, loginUser, getMe } from "../controllers/authC.js";
import { protect } from "../middleware/authM.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/me", protect, getMe);

export default router;