import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Post } from "../models/post.models.js";
import { User } from "../models/user.models.js";

import { v4 as uuid } from "uuid";
import { cloudinary } from "../utils/Cloudinary.js";
import fs from "fs";
import path from "path";


// ====================================================
// CREATE POST
// POST : /api/posts
// Protected
// ====================================================

const createPost = asyncHandler(async (req, res) => {
  const { body } = req.body;

  if (!body) {
    throw new ApiError(422, "Text field is required");
  }

  if (!req.files || !req.files.image) {
    throw new ApiError(422, "Please choose an image");
  }

  const image = req.files.image;

  const MAX_SIZE = 3 * 1024 * 1024;
  if (image.size > MAX_SIZE) {
    throw new ApiError(422, "Image size should be less than 3MB");
  }

  const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
  if (!allowedTypes.includes(image.mimetype)) {
    throw new ApiError(422, "Only image files are allowed");
  }

  const ext = path.extname(image.name);
  const fileName = `post-${req.user.id}-${uuid()}${ext}`;
  const uploadPath = path.join(process.cwd(), "uploads", fileName);

  await image.mv(uploadPath);

  const result = await cloudinary.uploader.upload(uploadPath, {
    folder: "stacksocial/posts",
    resource_type: "image",
  });

  fs.unlinkSync(uploadPath);

  const newPost = await Post.create({
    creator: req.user.id,
    body,
    image: result.secure_url,
  });

  const populatedPost = await Post.findById(newPost._id)
    .populate("creator", "fullname profilePhoto");

  res.status(201).json({
    success: true,
    message: "Post created successfully",
    post: populatedPost,
  });
});


// ====================================================
// GET SINGLE POST
// GET : /api/posts/:id
// Protected
// ====================================================

const getPost = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const post = await Post.findById(id)
    .populate("creator", "fullname profilePhoto")
    .populate({
      path: "comments",
      options: { sort: { createdAt: -1 } },
    });

  if (!post) {
    throw new ApiError(404, "Post not found");
  }

  res.status(200).json({
    success: true,
    post,
  });
});


// ====================================================
// GET ALL POSTS (HOME FEED)
// GET : /api/posts
// Protected
// ====================================================

const getPosts = asyncHandler(async (req, res) => {
  const posts = await Post.find()
    .populate("creator", "fullname profilePhoto")
    .populate({
      path: "comments",
      options: { sort: { createdAt: -1 } },
    })
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: posts.length,
    posts,
  });
});


// ====================================================
// GET FOLLOWING POSTS
// GET : /api/posts/following
// Protected
// ====================================================

const followingPost = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).select("following");

  const posts = await Post.find({
    creator: { $in: user.following },
  })
    .populate("creator", "fullname profilePhoto")
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: posts.length,
    posts,
  });
});


// ====================================================
// GET USER POSTS
// GET : /api/users/:id/posts
// Protected
// ====================================================

const usersPost = asyncHandler(async (req, res) => {
  const userId = req.params.id;

  const posts = await Post.find({ creator: userId })
    .populate("creator", "fullname profilePhoto")
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: posts.length,
    posts,
  });
});


// ====================================================
// UPDATE POST
// PATCH : /api/posts/:id
// Protected
// ====================================================

const updatePost = asyncHandler(async (req, res) => {
  const postId = req.params.id;
  const { body } = req.body;

  const post = await Post.findById(postId);
  if (!post) {
    throw new ApiError(404, "Post not found");
  }

  if (post.creator.toString() !== req.user.id) {
    throw new ApiError(403, "You can't update this post");
  }

  const updatedPost = await Post.findByIdAndUpdate(
    postId,
    { body },
    { new: true }
  ).populate("creator", "fullname profilePhoto");

  res.status(200).json({
    success: true,
    message: "Post updated successfully",
    post: updatedPost,
  });
});


// ====================================================
// DELETE POST
// DELETE : /api/posts/:id
// Protected
// ====================================================

const deletePost = asyncHandler(async (req, res) => {
  const postId = req.params.id;

  const post = await Post.findById(postId);
  if (!post) {
    throw new ApiError(404, "Post not found");
  }

  if (post.creator.toString() !== req.user.id) {
    throw new ApiError(403, "You are not allowed to delete this post");
  }

  await Post.findByIdAndDelete(postId);

  res.status(200).json({
    success: true,
    message: "Post deleted successfully",
  });
});


// ====================================================
// LIKE / DISLIKE POST
// POST : /api/posts/:id/like
// Protected
// ====================================================

const likeDislike = asyncHandler(async (req, res) => {
  const postId = req.params.id;
  const userId = req.user.id;

  const post = await Post.findById(postId);
  if (!post) {
    throw new ApiError(404, "Post not found");
  }

  const isLiked = post.likes.some(
    (id) => id.toString() === userId
  );

  if (!isLiked) {
    post.likes.push(userId);
  } else {
    post.likes = post.likes.filter(
      (id) => id.toString() !== userId
    );
  }

  await post.save();

  res.status(200).json({
    success: true,
    likes: post.likes,
  });
});



// ==================================================== BOOKMARK POST
// POST : /api/posts/:id/bookmark
// Protected

const createBookmark = asyncHandler(async (req, res) => {
  const postId = req.params.id;
  const userId = req.user.id;

  if (!postId) {
    throw new ApiError(400, "Post ID missing");
  }

  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const alreadyBookmarked = user.bookmarks.some(
    (id) => id.toString() === postId
  );

  let updatedUser;

  if (alreadyBookmarked) {
    updatedUser = await User.findByIdAndUpdate(
      userId,
      { $pull: { bookmarks: postId } },
      { new: true }
    );
  } else {
    updatedUser = await User.findByIdAndUpdate(
      userId,
      { $addToSet: { bookmarks: postId } }, 
      { new: true }
    );
  }

  res.status(200).json({
    success: true,
    bookmarked: !alreadyBookmarked,
    bookmarks: updatedUser.bookmarks,
  });
});



// ====================================================
// GET USER BOOKMARKS
// GET : /api/users/bookmark
// Protected
// ====================================================

const getUserBookmark = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).populate({
    path: "bookmarks",
    populate: {
      path: "creator",
      select: "fullname profilePhoto",
    },
    options: { sort: { createdAt: -1 } },
  });

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }

  // 🔥 REMOVE NULL POSTS (very important)
  const validBookmarks = user.bookmarks.filter(Boolean);

  res.status(200).json({
    success: true,
    count: validBookmarks.length,
    bookmarks: validBookmarks,
  });
});



// ====================================================
// EXPORTS
// ====================================================

export {
  createPost,
  getPost,
  getPosts,
  followingPost,
  usersPost,
  updatePost,
  deletePost,
  likeDislike,
  createBookmark,
  getUserBookmark,
};
