import res from "express/lib/response.js";
import Question from "../models/question.model.js";
import user from "../models/user.model.js";
import { errorHandler } from "../utils/error.js";
import { validQuestion } from "../utils/validator.js";
import jwt from "jsonwebtoken";
import Answer from "../models/answer.model.js";
import Voteing from "../models/vote.model.js";

export const createQuestion = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return next(errorHandler(401, "Unauthorized access"));
    }

    const { title, body, tags = [] } = req.body;
    const { valid, errors } = validQuestion({ title, body });

    if (!valid) {
      return next(errorHandler(400, JSON.stringify(errors)));
    }

    const doc = await Question.create({
      title: title.trim(),
      body: body.trim(),
      tags: tags,
      author: userId,
    });

    return res.status(201).json({
      success: true,
      message: "Question created successfully",
      question: doc,
    });
  } catch (err) {
    next(err);
  }
};

export const listQuestion = async (req, res, next) => {
  try {
    const { tag } = req.query;
    let filter = {};

    if (tag) {
      filter.tags = tag.toLowerCase();
    }

    const docs = await Question.find(filter)
      .populate("author", "username email")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: docs.length,
      questions: docs,
    });
  } catch (err) {
    next(err);
  }
};

export const requireAuth = (req, res, next) => {
  // get token from cookie or Authorization header
  const token =
    req.cookies?.access_token || req.headers["authorization"]?.split(" ")[1];

  if (!token) {
    return next(errorHandler(401, "No token, unauthorized"));
  }

  try {
    // verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // attach user info to req
    req.user = { id: decoded.id };

    next(); // continue to controller
  } catch (err) {
    return next(errorHandler(403, "Invalid or expired token"));
  }
};

export const getQuestion = async (req, res, next) => {
  try {
    const { id } = req.params;
    const question = await Question.findById(id)
      .populate("author", "username email")
      .populate({
        path: "answers",
        populate: {
          path: "author",
          select: "username email",
        },
      });
    if (!question) {
      return next(errorHandler(404, "Question not found"));
    }
    return res.status(200).json({
      success: true,
      question: question,
    });
  } catch (err) {
    next(err);
  }
};

export const postAnswer = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { content } = req.body;
    const userId = req.user?.id;
    const question = await Question.findById(id);
    if (!question) {
      return next(errorHandler(404, "Question not found"));
    }
    const newAnswer = new Answer({
      content,
      author: userId,
      question: id,
    });
    const savedAnswer = await newAnswer.save();
    //add answer to the question
    question.answers.push(newAnswer._id);
    await question.save();

    const popultedAnswer = await savedAnswer.populate("author", "username");

    return res.status(201).json({
      success: true,
      message: "Answer created successfully",
      answer: popultedAnswer,
    });
  } catch (err) {
    next(err);
  }
};


export const vote = async (req, res, next) => {
  try {
    const { targetId, targetType, voteType } = req.body;
    const userId = req.user?.id;

    if(!userId) return next(errorHandler(401, "Unauthorized access"));

    const existingVote = await Voteing.findOne({
      userId,
      targetId,
      targetType,
      voteType,
    })

    if(existingVote) {
      if(existingVote.voteType === voteType) {
        await existingVote.deleteOne();
        await updateVoteCount(targetId, targetType);
        return res.status(200).json({
          success: true,
          message: "Vote removed successfully",
        });
      }else {
        existingVote.voteType = voteType;
        await existingVote.save();
        return res.status(200).json({
          success: true,
          message: "Vote updated successfully",
        }); 
      }
    }else{
        //new vote
        const newVote = new Voteing({
          userId,
          targetId,
          targetType,
          voteType,
        });
        await newVote.save();
        await updateVoteCount(targetId, targetType);
        return res.status(201).json()({
          success: true,
          message: "Vote created successfully",
    })
    };
  } catch (err) {
    next(err);
  }
}
// helper to update total votes on target
const updateVoteCount = async (targetType, targetId) => {
  const allVotes = await Vote.find({ targetId, targetType });
  const total = allVotes.reduce((sum, v) => sum + v.voteType, 0);

  if (targetType === "Question") {
    await Question.findByIdAndUpdate(targetId, { votes: total });
  } else if (targetType === "Answer") {
    await Answer.findByIdAndUpdate(targetId, { votes: total });
  }
};