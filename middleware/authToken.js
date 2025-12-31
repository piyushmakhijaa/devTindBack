import jwt from "jsonwebtoken"
import User from "../models/user.js"
const authToken =  async(req,res,next)=>{
    
    try{
        const {Token} = req.cookies;
        console.log(Token);
    if(!Token)
    {
        return res.status(401).send("invalid token");
         throw new Error("TOKEN INVALID MF!");
    }
    const {_id} =  jwt.verify(Token,process.env.JWT_SECRET);
    
    const user = await User.findOne({_id:_id});

    if(!user)
    {
        throw new Error("USER ID INVALID");
    }else{
    req.user = user;
    }

    
    
}catch(err){
    res.status(400).send(err.message);
}
next();

}

export default authToken;