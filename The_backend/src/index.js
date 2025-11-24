import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose"; 
import productRoutes from "./routes/products.js";
import {connectDB} from "./config/db.js";
import authRoutes from "./routes/auth.js";
import categoryRoutes from "./routes/categories.js";
import bookingRoutes from "./routes/bookings.js";

dotenv.config();
const app= express();
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/bookings", bookingRoutes);

await connectDB();

const PORT = process.env.PORT || 4000;
app.listen(PORT, ()=>console.log(`Server running on port ${PORT}`));