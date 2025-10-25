import mongoose from "mongoose";

const AnswerSchema  = new mongoose.Schema({
    question:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Question",
        required:true,
    },
    content:{
        type:String,
        required:true,
    },
    author:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    votes:{
        type:Number,
        default:0,
    },
    createdAt:{
        type:Date,
        default:Date.now,
    },
},{timestamps:true});

const Answer = mongoose.model("Answer", AnswerSchema);

export default Answer;