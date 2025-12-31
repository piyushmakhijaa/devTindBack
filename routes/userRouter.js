import express from "express";
import authToken from "../middleware/authToken.js";
import User from "../models/user.js"
import connectionRequest from "../models/connectionRequest.js";

const userRouter = express.Router();

userRouter.get("/user/requests", authToken, async(req,res)=>{
    
    try{

        
        const loggedInUser = req.user;
        
        const data =  await connectionRequest.find({
        toUserId : loggedInUser._id,
        status : "interested"
    }).populate("fromUserId", ["firstName", "lastName", "age","gender","photoUrl","about","skills"]);

    if(!data)
        res.status(400).json({message : "No Requests"});
    
    res.json({message : "PEOPLE INTERESTED IN YOU - ", data});
}catch(err){
    res.status(400).send(err.message);
}
    
});

userRouter.get("/user/connections", authToken, async(req,res)=>{
     try{
    const loggedInUser = req.user;
    const data = await connectionRequest.find({
        $or:[{ toUserId : loggedInUser._id},
            {fromUserId : loggedInUser._id}],
             status : "accepted"
    }).populate("fromUserId")

    res.json({message : "HERE ARE YOUR CONNECTIONS", data});
     }catch(err){
        res.status(400).send(err.message);
     }
});


userRouter.get("/user/feed",authToken, async(req,res)=>{
           
    try{

        const page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 2;
        limit =  limit>100 ? 50 : limit;
        const skip= page*2 -2;


        const loggedInUser = req.user;

     const data = await connectionRequest.find({
           $or:[ 
            {toUserId : loggedInUser._id},
            {fromUserId: loggedInUser._id}
        
        
        ]}).select("fromUserId toUserId");
        
        const dataa = data.map(d =>{
            if(d.toUserId.toString() === loggedInUser._id.toString())
                return d.fromUserId;
            
            return d.toUserId;
        })

        dataa.push(loggedInUser._id);

       const users = await User.find(
        { _id: { $nin: dataa } },
        {_id : 1 , emailId : 0 , password : 0 , __v : 0 , createdAt : 0 , updatedAt : 0}
    ) // .skip(skip).limit(limit);
       
      res.json({message: "HERE ARE YOUR FEED APPEARANCES",users});
    

    }catch(err)
    {
        res.status(400).json({message : err.message});
    }
})



export default userRouter;