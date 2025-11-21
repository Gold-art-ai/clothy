import Booking from '../models/Booking.js';
import Product from '../models/Product.js';
import notifier from "../utils/notifier.js";
export const createBooking = async (req, res, next) =>{
    try{
        const {product: productId, quantity= 1, message= " "} = req.body;
        if(!productId || !quantity) return res.status(400).json({message: "Product ID and quantity are required"});

        const product = await Product.findById(productId);
        if(!product) res.status(404).json({message: "Product not found"});
        if (product.stock < quantity) return res.status(400).json({message: "Sorry we have not enough stock!"});
        const totalPrice = product.price * quantity;
        const booking = await Booking.create({
            product:product._id,
            user: req.user._id,
            quantity,
            message,
            totalPrice,
            status: "pending",
        });
        product.stock -= quantity;
        await product.save();
if(product.owner){
    notifier.send({
        to: product.owner,
        subject: "New Booking created",
        text: `Your product", ${product.title}, " is booked. QTY: " ${quantity}`,
        bookingId: booking>_id
    })

}
const populated = await Booking.findById(booking._id)
.populate("product", "title price images owner")
.populate("user", "name email");
res.status(201).json(populated);
        }
    catch(err){
        console.error("createBooking error: ", err);
        res.status(500).json({message: "server error"});
    }};
   
