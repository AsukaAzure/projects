import mongoose from "mongoose";

const AnswerSchema = new mongoose.Schema({
    content: {
        type: String,
        require: true
    },
    questionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Question',
        require: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        require: true
    },
    votes: {
        type: Number,
        require: true
    },
})

const Answer = mongoose.model("Answer", AnswerSchema);

export default Answer;