import { Server } from "socket.io";
import Message from "../models/message.js";
const initializeSocket = (server)=>{
const io = new Server(server,{
    cors:{
        origin : ["http://localhost:5173","http://13.48.192.52"],
        credentials : true
    }
})

io.on("connection",(socket)=>{
    console.log(socket.id,"hello");
    
    
    socket.on("joinChat",({_id,targetUserId})=>{
      // console.log({_id,targetUserId});
        const roomId = [_id,targetUserId].sort().join("_");
        console.log(roomId);
        socket.join(roomId);

    });

    socket.on("message", async(messageData)=>{
        console.log(messageData);
        const roomId = [messageData.senderId,messageData.receiverId].sort().join("_");
        socket.to(roomId).emit("receive-message",messageData);
         
        const message = await Message.create({
            roomId,
            senderId : messageData.senderId,
            receiverId : messageData.receiverId,
            text : messageData.text,
            sentAt : new Date()
        });
        //console.log(message);
    })

});
}

export default initializeSocket;