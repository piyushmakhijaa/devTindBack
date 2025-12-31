import moongoose from "mongoose"
const connectDB = async()=>{
     await moongoose.connect(process.env.MONGODB_URI);
}
export default connectDB;