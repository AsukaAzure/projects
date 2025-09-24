import express from 'express'
import { createQuestion, listQuestion, requireAuth } from '../controllers/question.controller.js';

const router = express.Router();

router.post("/postquestion" ,createQuestion);
router.get("/getquestion", listQuestion)

export default router;