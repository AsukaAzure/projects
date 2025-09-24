import Question from "../models/question.model.js";
import user from "../models/user.model.js"
import { errorHandler } from "../utils/error.js";
import { validQuestion } from "../utils/validator.js";
import jwt from 'jsonwebtoken'

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
      .sort({ createedAt: -1 });

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
    req.cookies?.access_token ||
    req.headers["authorization"]?.split(" ")[1];

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