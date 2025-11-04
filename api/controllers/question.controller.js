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
    const targetId = req.params.id; // id of question or answer being voted
    const { targetType, voteType } = req.body; // targetType: 'question'|'answer', voteType: 'upvote'|'downvote'
    const userId = req.user?.id;

    if (!userId) return next(errorHandler(401, "Unauthorized access"));
    if (!targetId || !targetType || !voteType)
      return next(errorHandler(400, "Missing vote data"));

    // map to models / canonical strings
    const Model = targetType === "answer" ? Answer : Question;
    const VoteTargetType = targetType === "answer" ? "Answer" : "Question";
    const v = voteType === "upvote" ? 1 : voteType === "downvote" ? -1 : 0;
    if (v === 0) return next(errorHandler(400, "Invalid voteType"));

    // load target with author and vote arrays
    let target = await Model.findById(targetId).populate("author");
    if (!target) return next(errorHandler(404, "Target not found"));

    // prevent voting on own post
    if (target.author && target.author._id.toString() === userId.toString()) {
      return next(errorHandler(400, "You cannot vote on your own post"));
    }

    // find existing vote record
    const existing = await Voteing.findOne({
      userId,
      targetId,
      targetType: VoteTargetType,
    });

    // helper to ensure arrays exist
    target.upvotes = Array.isArray(target.upvotes) ? target.upvotes : [];
    target.downvotes = Array.isArray(target.downvotes) ? target.downvotes : [];

    // If user already voted same way -> remove vote (idempotent)
    if (existing && existing.voteType === v) {
      await existing.deleteOne();
      if (v === 1) {
        target.upvotes = target.upvotes.filter((u) => u.toString() !== userId.toString());
      } else {
        target.downvotes = target.downvotes.filter((u) => u.toString() !== userId.toString());
      }
      target.votes = (target.upvotes.length || 0) - (target.downvotes.length || 0);
      await target.save();

      // update author reputation reversal
      const author = target.author;
      if (author) {
        if (v === 1) author.reputation = (author.reputation || 0) - 10;
        if (v === -1) author.reputation = (author.reputation || 0) + 2;
        await author.save();
      }

      return res.status(200).json({
        success: true,
        message: "Vote removed",
        votes: target.votes,
        userVote: 0,
      });
    }

    // If user had opposite vote -> switch
    if (existing && existing.voteType !== v) {
      const prev = existing.voteType;
      existing.voteType = v;
      await existing.save();

      // move user between arrays
      if (v === 1) {
        // remove from downvotes, add to upvotes
        target.downvotes = target.downvotes.filter((u) => u.toString() !== userId.toString());
        if (!target.upvotes.some((u) => u.toString() === userId.toString()))
          target.upvotes.push(userId);
      } else {
        target.upvotes = target.upvotes.filter((u) => u.toString() !== userId.toString());
        if (!target.downvotes.some((u) => u.toString() === userId.toString()))
          target.downvotes.push(userId);
      }

      target.votes = (target.upvotes.length || 0) - (target.downvotes.length || 0);
      await target.save();

      // adjust reputation for switching
      const author = target.author;
      if (author) {
        // switching from prev -> v: calculate net change
        if (prev === 1 && v === -1) {
          // removed +10, applied -2 -> net -12
          author.reputation = (author.reputation || 0) - 12;
        } else if (prev === -1 && v === 1) {
          // removed -2, applied +10 -> net +12
          author.reputation = (author.reputation || 0) + 12;
        }
        await author.save();
      }

      return res.status(200).json({
        success: true,
        message: "Vote updated",
        votes: target.votes,
        userVote: v,
      });
    }

    // New vote (no existing)
    const newVote = new Voteing({
      userId,
      targetId,
      targetType: VoteTargetType,
      voteType: v,
    });
    await newVote.save();

    if (v === 1) {
      if (!target.upvotes.some((u) => u.toString() === userId.toString()))
        target.upvotes.push(userId);
      // make sure not present in downvotes
      target.downvotes = target.downvotes.filter((u) => u.toString() !== userId.toString());
    } else {
      if (!target.downvotes.some((u) => u.toString() === userId.toString()))
        target.downvotes.push(userId);
      target.upvotes = target.upvotes.filter((u) => u.toString() !== userId.toString());
    }

    target.votes = (target.upvotes.length || 0) - (target.downvotes.length || 0);
    await target.save();


    // update author reputation
    const author = target.author;
    if (author) {
      if (v === 1) author.reputation = (author.reputation || 0) + 10;
      if (v === -1) author.reputation = (author.reputation || 0) - 2;
      await author.save();
    }

    return res.status(201).json({
      success: true,
      message: "Vote recorded",
      votes: target.votes,
      userVote: v,
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

    // Also remove the answer from the question's answers array
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
