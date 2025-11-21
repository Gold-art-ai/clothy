import User from "../models/User.js";
import jwt from "jsonwebtoken";

const generateToken = (id) => jwt.sign({id}, process.env.JWT_SECRET, {expiresIn: "30d"});
export const registerUser = async (req, res) =>{
    const {name, email, password} = req.body;

    const userExists = await User.findOne({email});
    if(userExists){
        return  res.status(400).json({message: "User already exists"});
};
    const user = await User.create({ name, email, password});
    res.status(201).json({ token: generateToken(user._id) });
};

export const loginUser = async (req, res) =>{
     const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ message: "Invalid credentials" });

  const isMatch = await user.matchPassword(password);
  if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

  res.json({ token: generateToken(user._id) });
};

export const getMe = async (req, res) => {
  const user = await User.findById(req.user.id).select("-password");
  res.json(user);
};