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
},{timestamps: true});

// one vote per user per target no multi
voteing.index({ userId: 1, targetId: 1, targetType: 1 }, { unique: true });

const Voteing = mongoose.model("Voteing", voteing);

export default Voteing;

