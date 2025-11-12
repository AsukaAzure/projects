import bcryptjs from "bcryptjs";
import user from "../models/user.model.js";
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";
import Question from "../models/question.model.js";
import Answer from "../models/answer.model.js";
import Voteing from "../models/vote.model.js";

export const signup = async (req, res, next) => {
  const { username, email, password } = req.body;
  const hashedPassword = bcryptjs.hashSync(password, 10);
  const newUser = new user({ username, email, password: hashedPassword });
  try {
    await newUser.save();
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);

    const { password: pass, ...rest } = newUser._doc;

    res.status(201).json({
      success: true,
      message: "User created successfully!",
      user: rest,
      token: token,
    });
  } catch (error) {
    // 11000 -> mongo says its a dubplicate key
    if (error.code === 11000) {
      // duplicate key error
      if (error.keyPattern.username) {
        return res.status(400).json({ success: false, message: "Username already exists" });
      }
      if (error.keyPattern.email) {
        return res.status(400).json({ success: false, message: "Email already exists" });
      }
    }
    next(error);
  }
};

export const signin = async (req, res, next) => {
  const { username, password } = req.body;
  try {
    const validUser = await user.findOne({ username });
    if (!validUser) return next(errorHandler(401, "User not found!"));
    const validPassword = bcryptjs.compareSync(password, validUser.password);
    if (!validPassword) return next(errorHandler(401, "Invalid Password!"));
    const token = jwt.sign(
      { id: validUser._id },
      process.env.JWT_SECRET
    );
    const { password: pass, ...rest } = validUser._doc;
    res.status(200).json({
      success: true,
      message: "Logged in successfully!",
      user: rest,
      token: token,
    });
  } catch (error) {
    next(error);
  }
};

export const getUserProfile = async (req, res, next) => {
  try {
    const userId = req.params.id;

    // 1️⃣ Find the user (without password)
    const User = await user.findById(userId).select("-password");
    if (!User) {
      return res.status(404).json({ message: "User not found" });
    }

    // get user QandA
    const questions = await Question.find({ author: userId })
      .select("title votes answers createdAt")
      .sort({ createdAt: -1 })
      .limit(5);

    const answers = await Answer.find({ author: userId })
      .select("content votes createdAt question")
      .sort({ createdAt: -1 })
      .limit(5);

    const profileData = {
      username: User.username,
      email: User.email,
      joinedDate: User.createdAt,
      reputation: User.reputation || 0,
      questionsAsked: questions.length,
      answersGiven: answers.length,
      recentQuestions: questions,
      recentAnswers: answers,
    };

    res.status(200).json(profileData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching profile", error: error.message });
  }
};


export const getLeaderboard = async (req, res, next) => {
  try {
    const users = await user.find();

    const leaderboard = await Promise.all(
      users.map(async (user) => {
        // finds q and a of user
        const userQuestions = await Question.find({ author: user._id });
        const userAnswers = await Answer.find({ author: user._id });

        const questionUpvotes = userQuestions.reduce(
          (acc, q) => acc + (q.upvotes?.length || 0),
          0
        );
        const answerUpvotes = userAnswers.reduce(
          (acc, a) => acc + (a.upvotes?.length || 0),
          0
        );

        const totalUpvotes = questionUpvotes + answerUpvotes;

        return {
          userId: user._id,
          username: user.username,
          reputation: user.reputation || 0,
          totalUpvotes,
          questionsAsked: userQuestions.length,
          answersGiven: userAnswers.length,
        };
      })
    );
    leaderboard.sort((a, b) => b.reputation - a.reputation);

    res.status(200).json({
      success: true,
      leaderboard,
    });
  } catch (err) {
    next(err);
  }
};