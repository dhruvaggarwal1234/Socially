import express from "express";
import { authMiddleware } from "../Middlewares/authMiddleware.js";
const router = express.Router();


import {  ChangeProfile,  followUnfollowUser,  editUser,  getUser,  getUsers,  loginUser,registerUser} from "../Controllers/userControllers.js";

import { getUserBookmark, usersPost } from "../Controllers/postControllers.js";
// ================= AUTH =================
router.post("/register", registerUser);
router.post("/login", loginUser);

// ================= USERS ================
router.patch("/avatar", authMiddleware,ChangeProfile);

router.get("/bookmarks" ,authMiddleware, getUserBookmark);
router.get("/:id", authMiddleware, getUser);
router.get("/",authMiddleware,getUsers);

router.get("/:id/posts" ,authMiddleware,usersPost);
router.patch("/:id", authMiddleware, editUser);
router.patch("/:id/follow-unfollow",authMiddleware, followUnfollowUser);



export { router};
