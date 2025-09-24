import mongoose, { mongo } from "mongoose";

const QuesSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      require: true,
      trim: true,
      minlength: 10,
      maxlength: 150,
    },
    body: {
      type: String,
      require: true,
      minlength: 20,
      maxlength: 20000,
    },
    tags: {
      type: [String],
      require: true,
    },

    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      require: true,
      index: true,
    },

    votes: {
        type: Number,
        default: 0,
    },

    answersCount: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  { timestamps: true }
);

//text search index
QuesSchema.index({ title: "text", body: "text" });

const Question = mongoose.model("Question", QuesSchema);

export default Question;
