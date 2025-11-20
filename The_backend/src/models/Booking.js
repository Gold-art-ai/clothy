import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
    {
    user: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true},
    product: {type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true},
    quantity: {type: Number, default: 0, min: 1},
    totalPrice: {type: Number, default: 0},
    status: {type: String, enum: ['pending', 'confirmed', 'canceled'], default: 'pending'},
}, {timestamps: true
    
}
);


export default mongoose.model("Booking", bookingSchema);
