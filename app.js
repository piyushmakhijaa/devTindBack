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
import instance from "./utils/razorpayInitiate.js";
import userRouter from "./routes/userRouter.js";
import authToken from "./middleware/authToken.js";
dotenv.config();
console.log(process.env.RAZORPAY_KEY_ID)
const port = 3000;
const app = express();
app.use(express.json());
app.use(cors({
    origin : ["http://13.48.192.52","http://localhost:5173"],
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


app.patch("/user", authToken, async(req,res)=>{
    const id = req.user._id;
    
    let skills = req.body.skills.trim().split(',');
    req.body.skills = skills;
    
    const data = req.body;
    console.log(data);
try{
  const user =  await User.findByIdAndUpdate(id,data,{returnDocument:'after',runValidators : true});
  console.log(user);
   res.send(({_id:user._id,
            firstName:user.firstName,
            lastName:user.lastName,
            emailId : user.emailId,
            photoUrl:user.photoUrl,
            age:user.age,
            gender:user.gender,
            about:user.about,
            skills:user.skills}));
}catch(err){
    res.send(err.message);
}
})
 
app.post("/payment/create",authToken , async(req,res)=>{
 try{
    const id = req.user._id;
    const data = req.body;
    const {firstName,lastName, emailId} = req.user;
    //console.log(id);

   var options = {
  amount: data.amount*100,  // Amount is in currency subunits. 
  currency: "INR",
  receipt: "order_rcptid_1",
  notes : {
    firstName : req.user.firstName,
    lastName : req.user.lastName,
    membershipType : data.membershipType
  }
};

instance.orders.create(options, function (err, order) {
  if (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Razorpay order creation failed",
      error: err,
    });
  }

  res.json({
    order,
    key : process.env.RAZORPAY_KEY_ID
  });
});

}catch(err){
    console.log(err);
return res.status(500).json({apiError : err.message});
}    

})


