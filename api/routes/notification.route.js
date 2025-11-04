import express from "express";
import { getNotifications, markRead, markAllRead } from "../controllers/notification.controller.js";
import { requireAuth } from "../controllers/question.controller.js"; // or wherever requireAuth middleware lives

const router = express.Router();

router.get("/", requireAuth, getNotifications);
router.post("/:id/read", requireAuth, markRead);
router.post("/markAllRead", requireAuth, markAllRead);

export default router;