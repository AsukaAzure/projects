import express from "express";
import {
  createQuestion,
  listQuestion,
  requireAuth,
  getQuestion,
  postAnswer,
  vote,
  deleteAnswer,
  deleteQuestion
} from "../controllers/question.controller.js";

const router = express.Router();

router.post("/postquestion", requireAuth, createQuestion);
router.get("/getquestion", listQuestion);
router.get("/getquestion/:id", getQuestion);
router.post("/getquestion/:id/answer",requireAuth, postAnswer);
router.post("/getquestion/:id/vote", requireAuth, vote);
router.delete("/getquestion/:id/delete", requireAuth, deleteQuestion);
router.delete("/getquestion/:id/deleteanswer", requireAuth, deleteAnswer);

export default router;
