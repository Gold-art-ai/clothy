import express from "express";
import {createBooking, listBookings, getBooking, cancelBooking,  confirmBookings} from "../controllers/bookingsC.js";
import {protect} from "../middleware/authM.js";

const router = express.Router();
router.post("/", protect, createBooking);
router.get("/", protect, listBookings);
router.put("/:id/comfirm", protect, confirmBookings);
router.put("/:id/cancel", protect, cancelBooking);
router.get("/:id", protect, getBooking);
export default router;
