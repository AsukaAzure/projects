import mongoose from "mongoose";

const NotificationSchema = new mongoose.Schema({
    reciever: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },

    message: {
      type: String,
      required: true
    },

    typeofnotification: {
        type: String,
        enum: [ "answer", "vote" ],
        required: true
    },

    question: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Question"
    
    },

    read: {
        type: Boolean,
        default: false
    },

    createdAt: {
        type: Date,
        default: Date.now,
    }
    
})

const Notification = mongoose.model("Notification", NotificationSchema);

export default Notification;