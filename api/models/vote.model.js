import mongoose from "mongoose";

const voteing = new mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    targetId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    targetType: {
        type: String,
        enum: ["Question", "Answer"],
        required: true,
    },
    voteType: {
        type: Number,
        enum: [-1, 1],
        required: true,
    },
    
},{timestamps: true})

const Voteing = mongoose.model("Voteing", voteing);

export default Voteing;

