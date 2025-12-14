import express from "express";
import { protect } from "../Controllers/authMiddleware.js";
const router = express.Router();


import {
  ChangeProfile,
  followUnfollowUser,
  editUser,
  getUser,
  getUsers,
  loginUser,
  registerUser
} from "../Controllers/userControllers.js";

// ================= AUTH =================
router.post("/register", registerUser);
router.post("/login", loginUser);

// ================= USERS ================
router.get("/:id", getUser);
router.get("/", getUsers);
router.patch("/edits", protect,editUser);
router.patch("/:id/follow-unfollow", followUnfollowUser);
router.patch("/avatar", ChangeProfile);

export { router};
