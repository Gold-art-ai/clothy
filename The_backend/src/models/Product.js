import mongoose from "mongoose";
const productSchema = new mongoose.Schema({
    title: {type: String, required: true},
    slug: {type: String, required: true, unique: true},
    description: {type: String, default: ""},
    price: {type: Number, required: true},
    images:[{type: String, default: []}],
    category: {type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true},
    owner: {type: mongoose.Schema.Types.ObjectId, ref:"User"},
    stock: {type: Number, default: 1},
    metadata: {type: Object, default: {}},
}, {timestamps: true});
export default mongoose.model("Product", productSchema);