import mongoose from "mongoose";
import User from "./user.js";
const connectionSchema = new mongoose.Schema({
    fromUserId : {
        type : mongoose.Schema.Types.ObjectId,
        required : true,
        ref: "User"
    },
    toUserId : {
        type : mongoose.Schema.Types.ObjectId,
         required : true,
         ref: "User"
    },
    status:{
        type : String,
         required : true,
        enum:{
            values: ["interested","ignored","accepted","rejected"],
            message : '{VALUE} is incorrect status'
        }
    }
},{
    timestamps: true
})

export default mongoose.model("ConnectionRequest",connectionSchema);