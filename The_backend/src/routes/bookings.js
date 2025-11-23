import express from "express";
import {createBooking, listBookings, getBooking} from "../controllers/bookingsC.js";
import {protect} from "../middleware/authM.js";

const router = express.Router();
router.post("/", protect, createBooking);
router.get("/", protect, listBookings);
router.get("/:id", protect, getBooking);
export default router;
