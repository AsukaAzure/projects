// controllers/notificationController.js
import Notification from "../models/notification.model.js";
import Question from "../models/question.model.js";
// import Answer from "../models/answer.model.js";

/**
 * Notify question owner when someone answers
 */
export const notifyOnAnswer = async (answer, senderId) => {
  try {
    const question = await Question.findById(answer.question).populate("author");
    if (!question) return;

    // Don't notify the same user who answered their own question
    if (question.author._id.toString() === senderId) return;

    await Notification.create({
      receiver: question.author._id,
      sender: senderId,
      message: "Your question has received a new answer!",
      typeofnotification: "answer",
      question: question._id,
    });
  } catch (err) {
    console.error("Error creating answer notification:", err);
  }
};

/**
 * Notify when question or answer reaches every 10 upvotes
 */
export const notifyOnUpvote = async (target, type) => {
  try {
    const upvoteCount = target.upvotes?.length || 0;
    const authorId = target.author;

    // Trigger only on multiples of 10 (10, 20, 30...)
    if (upvoteCount > 0 && upvoteCount % 10 === 0) {
      await Notification.create({
        receiver: authorId,
        sender: null,
        message: `Your ${type} reached ${upvoteCount} upvotes!`,
        typeofnotification: "vote",
        question: type === "question" ? target._id : target.question,
      });
    }
  } catch (err) {
    console.error("Error creating upvote notification:", err);
  }
};

// Get all notifications for logged-in user
export const getNotifications = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    if (!userId) return next(errorHandler(401, "Unauthorized"));

    const notes = await Notification.find({ user: userId })
      .sort({ createdAt: -1 })
      .limit(100)
      .populate("triggeredBy", "username")
      .lean();

    return res.status(200).json({ success: true, notifications: notes });
  } catch (err) {
    next(err);
  }
};

export const markRead = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;
    if (!userId) return next(errorHandler(401, "Unauthorized"));

    const note = await Notification.findOneAndUpdate(
      { _id: id, user: userId },
      { $set: { read: true } },
      { new: true }
    );

    if (!note) return next(errorHandler(404, "Notification not found"));

    return res.status(200).json({ success: true, notification: note });
  } catch (err) {
    next(err);
  }
};

export const markAllRead = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    if (!userId) return next(errorHandler(401, "Unauthorized"));

    await Notification.updateMany({ user: userId, read: false }, { $set: { read: true } });

    return res.status(200).json({ success: true, message: "All notifications marked read" });
  } catch (err) {
    next(err);
  }
};
