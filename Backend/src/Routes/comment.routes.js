import express from "express";
import { getComments,createComment,deleteComment } from "../Controllers/commentControllers.js";
import { authMiddleware } from "../Middlewares/authMiddleware.js";

const commentRouter = express.Router();


commentRouter.post("/:postId" , authMiddleware,createComment)

commentRouter.get("/:postId" , authMiddleware ,getComments)

commentRouter.delete("/:commentId" , authMiddleware,deleteComment)


export {commentRouter};