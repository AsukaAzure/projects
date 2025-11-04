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
    upvotes:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
        },
    ],
    downvotes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
    ],
    
    createdAt:{
        type:Date,
        default:Date.now,
    },
},{timestamps:true});

const Answer = mongoose.model("Answer", AnswerSchema);

export default Answer;