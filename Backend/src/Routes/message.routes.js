import express from "express";
import { authMiddleware } from "../Middlewares/authMiddleware.js";
import {
  getMessages,
  getConservations,
  createMessage,
} from "../Controllers/messageControllers.js";

const messageRouter = express.Router();


messageRouter.get("/", authMiddleware, getConservations);

messageRouter.post("/:receiverId", authMiddleware, createMessage);

messageRouter.get("/:receiverId", authMiddleware, getMessages);

export { messageRouter };
