import connectDB from "./config/database.js";
import express, { json } from "express"
import dotenv from "dotenv";
import User from "./models/user.js"
import cors from "cors";
import cookieParser from "cookie-parser";
import authRouter from "./routes/authRoute.js";
import profileRouter from "./routes/profileRoute.js";
import requestRouter from "./routes/request.js";
import bcrypt from "bcrypt";
import userRouter from "./routes/userRouter.js";

dotenv.config();

const port = 3000;
const app = express();
app.use(express.json());
app.use(cors({
    origin : "http://localhost:5173",
    credentials : true
}));
app.use(cookieParser());
app.use("/",authRouter);
app.use("/",profileRouter);
app.use("/",requestRouter);
app.use("/",userRouter);
//console.log(await bcrypt.compare("piyush4","$2b$10$wg8m5YNB5Szs8JeIJA/MNOhtjraiOezrpVx/sPB5SG4Grd9g07Oji"));

connectDB().then(()=>{
    app.listen(port,()=>{
        console.log(`LISTENING ON PORT ${port}`);
    })

}).catch((err)=>{
    console.log(`ERROR : ${err}`);
})





app.delete("/delete", async(req,res)=>{
    let count;
    try{
  count =   await User.deleteMany(req.body);
  console.log(count);
    }catch(err){
        console.log(`ERROR IN DELETING ${err.message}`);
    }

    if(count.acknowledged)
    {
        res.send(`DELETED COUNT: ${count.deletedCount} `)
    }else{
        res.send("NO USERS FOUND FOR THIS CREDENTIALS");
    }


})


app.patch("/user", async(req,res)=>{
    const id = req.body.userId;
    const data = req.body;
try{
  const user =  await User.findByIdAndUpdate(id,data,{returnDocument:'after',runValidators : true});
  console.log(user);
   res.send(`USER UPDATED TO : ${user}`);
}catch(err){
    res.send(err.message);
}
})



