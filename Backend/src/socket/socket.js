import http from "http"
import {Server} from "socket.io"
import { app } from "../app.js"

const server = http.createServer(app);

const io = new Server(server , {
    cors : {
        origin :process.env.ORIGIN,
        methods :["GET", "POST" , "PATCH" ,"DELETE"],
    }
});


const getReceiverSocketId  = (recipientId)=>{
    return userSocketMap[recipientId];
}

const userSocketMap= {};

io.on("connection" , (socket) => {
    console.log("user connecter" , socket.id);
    const userId = socket.handshake.query.userId;

    if(userId != "undefined") userSocketMap[userId] =socket.id;
    io.emit("getOnlineUsers", Object.keys(userSocketMap));


    socket.on("disconnect", () =>{
        console.log("user disconnected");
        delete userSocketMap[userId];
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
    })
})

export {io , server, getReceiverSocketId}