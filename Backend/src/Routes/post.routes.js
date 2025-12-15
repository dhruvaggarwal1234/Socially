import express from "express";
import { authMiddleware } from "../Middlewares/authMiddleware.js";
import {createPost , getPost ,getPosts , updatePost,deletePost,followingPost,likeDislike, createBookmark} from "../Controllers/postControllers.js"

const postRouter = express.Router();

postRouter.post("/",authMiddleware,createPost);
postRouter.get("/" ,authMiddleware,getPosts);
postRouter.get("/following" ,authMiddleware,followingPost);
postRouter.get("/:id",authMiddleware,getPost);
postRouter.patch("/:id",authMiddleware,updatePost);
postRouter.delete("/:id",authMiddleware,deletePost);
postRouter.post("/:id/bookmark",authMiddleware,createBookmark)
postRouter.post("/:id/like",authMiddleware,likeDislike);



export {postRouter};