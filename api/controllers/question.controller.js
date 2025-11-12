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
  // get token from auth header
  const token =
    req.cookies?.access_token || req.headers["authorization"]?.split(" ")[1];

  if (!token) {
    return next(errorHandler(401, "No token, unauthorized"));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = { id: decoded.id };

    next(); 
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

    if(question.author.toString() === userId.toString()){
      return res.status(400).json({
        success: false,
        message: "You cannot answer your own question",
      });
    }

    const newAnswer = new Answer({
      content,
      author: userId,
      question: id,
    });
    const savedAnswer = await newAnswer.save();
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
    const targetId = req.params.id;
    const { targetType, voteType } = req.body; 
    const userId = req.user?.id;
    if (!userId) return next(errorHandler(401, "Unauthorized access"));
    if (!targetId || !targetType || !voteType)
      return next(errorHandler(400, "Missing vote data"));

    const VoteTargetType = targetType === "answer" ? "Answer" : "Question";
    const Model = VoteTargetType === "Question" ? Question : Answer;
    const v = voteType === "upvote" ? 1 : voteType === "downvote" ? -1 : 0;
    if (v === 0) return next(errorHandler(400, "Invalid voteType"));

    const target = await Model.findById(targetId).populate("author");
    if (!target) return next(errorHandler(404, "Target not found"));
    //no self vote
    const authorId = target.author && (target.author._id ? target.author._id.toString() : target.author.toString());
    if (authorId && authorId === userId.toString()) {
      return next(errorHandler(400, "You cannot vote on your own post"));
    }

    // upsert vote record in Voteing collection (use try/catch for unique index)
    const existing = await Voteing.findOne({ userId, targetId, targetType: VoteTargetType });
    let prevVote = existing ? existing.voteType : null;

    if (existing && existing.voteType === v) {
      // same vote then delete
      await existing.deleteOne();
    } else if (existing && existing.voteType !== v) {
      return next(errorHandler(400, "Cannot change vote: you already voted the opposite way"));
    } else {
      try {
        const nv = new Voteing({ userId, targetId, targetType: VoteTargetType, voteType: v });
        await nv.save();
      } catch (err) {
        if (err.code === 11000) {
          const reloaded = await Voteing.findOne({ userId, targetId, targetType: VoteTargetType });
          prevVote = reloaded ? reloaded.voteType : null;
          if (reloaded && reloaded.voteType === v) {
            await reloaded.deleteOne();
          } else if (reloaded && reloaded.voteType !== v) {
            return next(errorHandler(400, "Cannot change vote: you already voted the opposite way"));
          } else {
            await Voteing.create({ userId, targetId, targetType: VoteTargetType, voteType: v });
          }
        } else {
          throw err;
        }
      }
    }
    //calculates the total votes
    const upUserIds = await Voteing.find({ targetId, targetType: VoteTargetType, voteType: 1 }).distinct("userId");
    const downUserIds = await Voteing.find({ targetId, targetType: VoteTargetType, voteType: -1 }).distinct("userId");
    const totalVotes = upUserIds.length - downUserIds.length;

    const updatedTarget = await Model.findByIdAndUpdate(
      targetId,
      { $set: { votes: totalVotes, upvotes: upUserIds, downvotes: downUserIds } },
      { new: true }
    ).populate("author", "username reputation");

    // always return a numeric vote count — fallback to computed totalVotes if model doesn't have `votes`
    const finalVotes =
      typeof updatedTarget?.votes === "number" ? updatedTarget.votes : totalVotes;

    if (authorId && authorId !== userId.toString()) {
      let repDelta = 0;
      if (prevVote === null) {
        repDelta = v === 1 ? 10 : -2;
      } else if (prevVote === v) {
        repDelta = v === 1 ? -10 : 2;
      } else {
        if (prevVote === 1 && v === -1) repDelta = -12;
        if (prevVote === -1 && v === 1) repDelta = 12;
      }
      if (repDelta !== 0) {
        await user.findByIdAndUpdate(authorId, { $inc: { reputation: repDelta } });
      }
    }

    const userVoteDoc = await Voteing.findOne({ userId, targetId, targetType: VoteTargetType });
    const userVote = userVoteDoc ? userVoteDoc.voteType : 0;

    return res.status(200).json({
      success: true,
      message: (prevVote === null ? "Vote recorded" : prevVote === v ? "Vote removed" : "Vote updated"),
      votes: finalVotes,
      userVote,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteQuestion = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;
    const question = await Question.findById(id);

    if (!question) {
      return next(errorHandler(404, "Question not found"));
    }

    if (question.author.toString() != userId.toString()) {
      return next(errorHandler(401, "You are not a authorized person"));
    }

    await Answer.deleteMany({ question: id });
    await question.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Question deleted!",
    });
  } catch (err) {
    next(err);
  }
};

export const deleteAnswer = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;
    const answer = await Answer.findById(id);

    if (!answer) {
      return next(errorHandler(404, "Answer not Found"));
    }

    if (answer.author.toString() != userId.toString()) {
      return next(errorHandler(401, "You are not a authorized person"));
    }

    // also remove the answers 
    await Question.findByIdAndUpdate(answer.question, {
      $pull: { answers: answer._id },
    });

    await Answer.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "Answer Deleted!",
    });
  } catch (err) {
    next(err);
  }
};
