import mongoose from "mongoose";
import dotenv from "dotenv";
import Category from "../src/models/Category.js";

dotenv.config();
mongoose.connect(process.env.MONGO_URL)

const categories = [
    {name: "Men"},
    {name: "Women"},
    {name: "Kids"},
    {name: "Casual"},
    {name: "Office"},
    {name: "Sportswear"},
    ]
const seed = async () => {
    try{
        await Category.deleteMany({});
        await Category.insertMany(categories);
        console.log("Categories seeded successfully");
        process.exit();

    }catch(err){
        console.error(err);
        process.exit(1);
    }
};

connectDB().then(seed);

