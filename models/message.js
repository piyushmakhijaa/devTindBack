import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    roomId : {
        type : String,
        index : true,
        required: true
    },

    senderId : {
        type : mongoose.Schema.ObjectId,
        required : true,
        ref : "User"
    },

    receiverId : {
        type : mongoose.Schema.ObjectId,
        required : true,
        ref : "User"
    },

    text : {
        type : String,
        required : true
    },

    sentAt : {
        type : Date,
        default : Date.now,
        required : true,
        index : true
    }
        
});

export default mongoose.model("Message", messageSchema);