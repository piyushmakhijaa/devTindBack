import express from "express";
import User from "../models/user.js";
import bcrypt from "bcrypt"
const authRouter = express.Router();

authRouter.post("/signup", async(req,res)=>{
    const user = new User(req.body);
    const {password} = req.body;

    console.log(req.body);
try{
   
  const hashPass = await bcrypt.hash(password,10);
  user.password = hashPass;


   await user.save();
   res.send("USER CREATED");
}catch(err){
    console.log(`ERROR IN ADDING USER ${err.message}`);
    res.send(`ERROR IN ADDING USER ${err.message}`);
}


})

authRouter.post("/login", async(req,res)=>{
    try{
    const {emailId,password} = req.body;

    const user = await User.findOne({emailId:emailId});
    console.log(user);
    if(!user)
    {
    throw new Error("WRONG CREDENTIALS");
    }
    
    const isPassValid = await  user.isValidPassword(password);
    const token = user.getJWT();

    if(isPassValid)
    {
        res.cookie("Token",token,{path:"/",expires: new Date(Date.now() + 900000)});
        res.send({_id:user._id,
            firstName:user.firstName,
            lastName:user.lastName,
            photoUrl:user.photoUrl,
            age:user.age,
            gender:user.gender,
            about:user.about,
            skills:user.skills});
    }else{
        throw new Error("WRONG CREDENTIALS");
    }


    }catch(err){
        res.status(404).send(err.message);
    }

})

authRouter.post("/logout", (req,res)=>{
    try{
        if(req.cookies)
        {
             
            res.cookie("Token",null,{
                expires: new Date(Date.now()), path :"/"
            }).send("LOGGED-OUT SUCCESSFULLY");

        }
    }catch(err){
        res.status(400).send(`${err.message}`);
    }
})


export default authRouter;