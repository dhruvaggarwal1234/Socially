import express from "express"

import {getMessages,getConservations,createMessage} from "../Controllers/messageControllers.js" 

const messageRouter =express.Router();

messageRouter.get("/",getConservations);
messageRouter.post("/:recieverId",createMessage);
messageRouter.get("/:recieverId", getMessages);


export {messageRouter}