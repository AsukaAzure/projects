import express from "express";
import { signin, signup } from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/signin", signin);

router.post("/logout", (req, res) => {
  res.clearCookie("access_token", {
    httpOnly: true,
    sameSite: "strict",
    secure: true,
  });
  return res.status(200).json({ message: "Logged out successfully" });
});

export default router;
