import Booking from '../models/Booking.js';
import Product from '../models/Product.js';

export const createBooking = async (req, res, next) =>{
    try{
        const {product: productId, quantity} = req. body;
        const product = await Product.findById(productId);
        if(!product) res.status(404).json({message: "Product not found"});
        
        }
    catch(err){
        res.status(500).json({message: "server error"});
    }};
   
