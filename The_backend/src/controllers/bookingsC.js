import Booking from "../models/Booking.js";
import Product from "../models/Product.js";
import notifier from "../utils/notifier.js";
export const createBooking = async (req, res, next) => {
  try {
    const { productId, quantity = 1, message = "" } = req.body;
    if (!productId || !quantity) {
      return res.status(400).json({ message: "Product ID and quantity are required" });
    }
    const product = await Product.findById(productId);
    if (!product) res.status(404).json({ message: "Product not found" });
    if (product.stock < quantity) return res.status(400).json({ message: "Sorry we have not enough stock!" });
    const totalPrice = product.price * quantity;
    const booking = await Booking.create({
      product: product._id,
      user: req.user._id,
      quantity,
      message,
      totalPrice,
      status: "pending",
    });
    product.stock -= quantity;
    await product.save();
    if (product.owner) {
      notifier.send({
        to: product.owner,
        subject: "New Booking created",
        text: `Your product", ${product.title}, " is booked. QTY: " ${quantity}`,
        bookingId: booking > _id,
      });
    }
    const populated = await Booking.findById(booking._id)
      .populate("product", "title price images owner")
      .populate("user", "name email");
    res.status(201).json(populated);
  } catch (err) {
    console.error("createBooking error: ", err);
    res.status(500).json({ message: "Server error" });
  }
};
export const listBookings = async (req, res) => {
  try {
    const { mine } = req.query;
    let filter = {};
    if (String(mine) === "1" && req.user) {
      filter.user = req.user._id;
    }
    let bookings = await Booking.find(filter)
      .populate("product", "title price images")
      .populate("user", "name email")
      .sort({ createdAt: -1 })
      .limit(100);
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: "server error" });
  }
};

export const getBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const booking = await Booking.findById(id)
      .populate("product", "title price images")
      .populate("user", "name email");
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    if (req.user) {
      const isOwner =
        booking.product.owner &&
        booking.product.owner.toString() === req.user._id.toString();
      const isBooker = booking.user._id.toString() === req.user._id.toString();
      if (!isOwner && isBooker) {
        return res.status(403).json({ message: "Forbidden" });
      }
      res.json(booking);
    }
  } catch (err) {
    console.error("getBooking error: ", err);
    res.status(500).json({ message: "Server error" });
  }
};
export const confirmBookings = async (req,res) =>{
    try{
   const {id} = req.params;
   const booking = await Booking.findById(id)
   .populate("product")
   .populate("user")
   if(!booking) return res.status(404).json({message: "Booking not found!", booking});
   booking.status("comfirmed");
   booking.save();
   res.json({message: "Booking Confirmed"});
  } catch(err){
     res.status(500).json({message: "Server error"});
    }
};

export const cancelBooking = async (req,res) => {
    try{
        const {id} = req.params;
        const booking = await Booking.findById(id).populate("product").populate("user");
       if (!booking) return res.status(404).json({message: "Booking not found", booking});
       booking.status("Cancelled!");
       booking.save();
      res.json({message: "Booking cancelled"});
    }catch(err){
     res.status(500).json({message: "Server error"});
    }
}