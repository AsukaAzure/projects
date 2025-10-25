import bcryptjs from "bcryptjs";
import user from "../models/user.model.js";
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";

export const signup = async (req, res, next) => {
  const { username, email, password } = req.body;
  const hashedPassword = bcryptjs.hashSync(password, 10);
  const newUser = new user({ username, email, password: hashedPassword });
  try {
    await newUser.save();
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);

    const { password: pass, ...rest } = newUser._doc;

    res.status(201).json({
      success: true,
      message: "User created successfully!",
      user: rest,
      token: token,
    });
  } catch (error) {
    // 11000 -> mongo db says that there is a duplicate key
    if (error.code === 11000) {
      // Duplicate key error
      if (error.keyPattern.username) {
        return res.status(400).json({ success: false, message: "Username already exists" });
      }
      if (error.keyPattern.email) {
        return res.status(400).json({ success: false, message: "Email already exists" });
      }
    }
    next(error);
  }
};

export const signin = async (req, res, next) => {
  const { username, password } = req.body;
  try {
    const validUser = await user.findOne({ username });
    if (!validUser) return next(errorHandler(401, "Invalid User!"));
    const validPassword = bcryptjs.compareSync(password, validUser.password);
    if (!validPassword) return next(errorHandler(401, "Invalid Password!"));
    const token = jwt.sign(
      { id: validUser._id },
      process.env.JWT_SECRET
    );
    const { password: pass, ...rest } = validUser._doc;
    res.status(200).json({
      success: true,
      message: "Logged in successfully!",
      user: rest,
      token: token,
    });
  } catch (error) {
    next(error);
  }
};
