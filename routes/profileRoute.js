import express from "express"
import authToken from "../middleware/authToken.js";
import User from "../models/user.js";
import bcrypt from "bcrypt";

const profileRouter = express.Router();


profileRouter.get("/profile/view", authToken ,async(req,res)=>{
    try{
    const user = req.user;
    console.log(user);
    res.send({_id:user._id,
            firstName:user.firstName,
            lastName:user.lastName,
            photoUrl:user.photoUrl,
            age:user.age,
            gender:user.gender,
            about:user.about,
            skills:user.skills});
    }catch(err){
     res.status(400).send(err.message);
    }

})

profileRouter.patch("/profile/edit", authToken, async(req,res)=>{

    try{
    const allowedUpdates = ["firstName","lastName","gender","photoUrl","about","skills"];
    const loggedInUser = req.user;
    console.log(req.user);

    const isAllowed = Object.keys(req.body).every(k => allowedUpdates.includes(k));
    
    if(!isAllowed)
    {
        throw new Error("UPDATES NOT PERMITTED");
    }
   
    if(isAllowed)
    {
        //console.log(req.body);
    Object.keys(req.body).forEach(k =>{ loggedInUser[k] = req.body[k]});    
    await loggedInUser.save();
    res.send(`${req.user.firstName}, Your Profile has been updated!`);
}
    

    }catch(err){
        res.send(`${err.message}`);
    }


})

profileRouter.patch("/profile/password", authToken, async(req,res)=>{

    try{
    const isOldPassValid = await bcrypt.compare(req.body.oldPassword,req.user.password);
    
    if(isOldPassValid)
    {
        const loggedInUser = req.user;
       // console.log(loggedInUser.password)
        console.log(req.body.newPassword);
        loggedInUser.password = await bcrypt.hash(req.body.newPassword,10);
        await loggedInUser.save();
        res.send("PASSWORD CHANGED SUCCESSFULY");
    }else{
        res.status(400).send("WRONG CURRENT PASSWORD");
    }

    }catch(err){
        res.status(400).send(err.message);
    }

    
})

export default profileRouter;