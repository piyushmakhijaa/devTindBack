import { Server } from "socket.io";
import Message from "../models/message.js";
const initializeSocket = (server) => {
    const io = new Server(server, {
        cors: {
            origin: ["http://localhost:5173", "http://13.48.192.52"],
            credentials: true
        }
    });

    const idToSocketMapping = new Map();
    const socketToIdMapping = new Map();

    io.on("connection", (socket) => {
        console.log(socket.id, "hello");


        socket.on("joinChat", ({ _id, targetUserId }) => {
            // console.log({_id,targetUserId});
            idToSocketMapping.set(_id, socket.id);
            socketToIdMapping.set(socket.id, _id);
            const roomId = [_id, targetUserId].sort().join("_");
            console.log(roomId);
            socket.join(roomId);
            socket.broadcast.to(roomId).emit("joined-user", { _id });

        });

        socket.on("call-user", ({ _id, fromUserId, offer }) => {
            socket.to(idToSocketMapping.get(_id)).emit("incoming-call", { fromUserId, offer });
        });

        socket.on("answer-call", ({ to, answer }) => {
            socket.to(idToSocketMapping.get(to)).emit("call-answered", { answer });
        })

        socket.on("ice-candidate", ({ to, candidate }) => {
            socket.to(idToSocketMapping.get(to)).emit("ice-candidate", { candidate });
        })

        socket.on("message", async (messageData) => {
            console.log(messageData);
            const roomId = [messageData.senderId, messageData.receiverId].sort().join("_");
            socket.to(roomId).emit("receive-message", messageData);

            const message = await Message.create({
                roomId,
                senderId: messageData.senderId,
                receiverId: messageData.receiverId,
                text: messageData.text,
                sentAt: new Date()
            });
            //console.log(message);
        })

    });
}

export default initializeSocket;