import mongoose from "mongoose"
import validator from "validator";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const userSchema = mongoose.Schema({
    firstName:{
        type: String,
        required:true
    },
    lastName:{
        type:String
    },
    emailId:{
        type: String, 
        required: true,
        unique: true,
        lowercase : true,
        trim : true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Invalid Email Address " + value)
            }
        }
    },
    password:{
        type: String,
        required:true
    },
    age:{
        type: Number,
        required:true,
        min : 18
    },
    gender:{
        type: String,
        required:true,
        // validate(value){
        //     if(!["Male","Female","Other"].includes(value)){
        //         throw new Error("Gender Not Valid!");
        //     }
        // }
         enum: {
      values: ['Male', 'Female','Other'],
      message: '{VALUE} is not supported'
    }
    },
    photoUrl:{
        type: String,
        default : "https://www.shutterstock.com/image-vector/vector-design-avatar-dummy-sign-600nw-1290556063.jpg",
        validate(value){
            if(!validator.isURL(value)){
                throw new Error("Invalid Photo URL " + value)
            }
        }
    },
    about:{
        type: String,
        default : "Hello,Im Ready to Socialize!"
    },
    skills:{
        type: [String]
    }
},{
    timestamps: true
})

//while writing schema methods, arrow functions crash the code; so always use normal functions!!!!!!


userSchema.methods.getJWT = function(){
    const user = this;

    const token = jwt.sign({_id: user._id},process.env.JWT_SECRET);
    return token;

}

userSchema.methods.isValidPassword = async function (password) {
    const user = this;
    const isValid = await bcrypt.compare(password,user.password);
    return isValid;
}

userSchema.methods.hashPassword  = async function (password) {
    const user = this;

  return  await bcrypt.hash(password,10);
    
}


export default mongoose.model("User",userSchema);