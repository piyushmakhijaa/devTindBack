import express from "express"
import authToken from "../middleware/authToken.js";
import ConnectionRequest from "../models/connectionRequest.js"
import User from "../models/user.js"
import mongoose from "mongoose";
const requestRouter = express.Router();

requestRouter.post("/request/send/:status/:toUserId", authToken ,async(req,res)=>{
    try{
        console.log(req.user);
        
        const fromUserId = req.user._id;
        const toUserId = req.params.toUserId;
        const status = req.params.status;

        if(fromUserId.toString() === toUserId.toString())
            return res.status(400).json({ error: "SELF REQUEST CANT BE MADE" });


        if (!mongoose.Types.ObjectId.isValid(toUserId)) {
      return res.status(400).json({ error: "Invalid User ID format" });
    }
        const toUser = await User.findById(toUserId);

        if(!toUser)
        {
            return res.status(400).json({ error : "USER NOT FOUND"})
        }

        const allowedStatus = ["ignored","interested"];
        if(!allowedStatus.includes(status)){
            throw new Error("INVALID STATUS TYPE : " + status);
        }

        
        if(!(await ConnectionRequest.findOne({
            $or:[
                {fromUserId,toUserId},
                {toUserId,fromUserId}
            ]
        }))){

            const connectionRequest = new ConnectionRequest({
                fromUserId,
                toUserId,
                status
            });


          const data =  await connectionRequest.save();

           res.json({
            message : "Connection Request Sent Successfuly!",
            data
           })
        }else{
            res.status(400).send(`${req.user.firstName} has already sent ${status} to ${toUser.firstName}!!!`)
           // throw new Error("Connection already has been made!")
        }



     


    }catch(err){
        res.send(err.message);
    }



})


requestRouter.post("/request/review/:status/:requestId",authToken, async(req,res)=>{

    try{

        const status = req.params.status;
        const loggedInUser = req.user;
        const requestId = req.params.requestId;
        const allowedStatus = ["accepted","rejected"];

        if(!allowedStatus.includes(status))
        {
            return res.status(400).send(`INVALID STATUS ${status}`);
        }

        const connection = await ConnectionRequest.findOne({
            _id: requestId,
            toUserId: loggedInUser._id,
            status : "interested"
        });

        if(!connection)
        {
            return res.status(400).send("connection request invalid");
        }

        connection.status = status;

      const data =   await connection.save();

      res.json({message : "Request succesful", data});




    
    }catch(err)
    {
        res.status(400).send(err.message);
    }
})

export default requestRouter;