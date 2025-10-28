import express from "express";
import {
  createQuestion,
  listQuestion,
  requireAuth,
  getQuestion,
  postAnswer,
  vote
} from "../controllers/question.controller.js";

const router = express.Router();

router.post("/postquestion", requireAuth, createQuestion);
router.get("/getquestion", listQuestion);
router.get("/getquestion/:id", getQuestion);
router.post("/getquestion/:id/answer",requireAuth, postAnswer);
router.post("/getquestion/:id/vote", requireAuth, vote);

export default router;
