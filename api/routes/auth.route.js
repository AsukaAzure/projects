import express from "express";
import { getLeaderboard, getUserProfile, signin, signup } from "../controllers/auth.controller.js";
import { requireAuth } from "../controllers/question.controller.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/signin", signin);
router.get("/:id/profile", requireAuth, getUserProfile);
router.get("/leaderboard", getLeaderboard);

router.post("/logout", (req, res) => {
  res.clearCookie("access_token", {
    httpOnly: true,
    sameSite: "strict",
    secure: true,
  });
  return res.status(200).json({ message: "Logged out successfully" });
});

export default router;
