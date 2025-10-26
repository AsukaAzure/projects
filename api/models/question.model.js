import mongoose, { mongo } from "mongoose";

const QuesSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 10,
      maxlength: 150,
    },
    body: {
      type: String,
      required: true,
      minlength: 20,
      maxlength: 20000,
    },
    tags: {
      type: [String],
      required: true,
    },

    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    votes: {
        type: Number,
        default: 0,
    },

    answers: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Answer",
      // default: 0,
    }],
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

//text search index
QuesSchema.index({ title: "text", body: "text" });

const Question = mongoose.model("Question", QuesSchema);

export default Question;
