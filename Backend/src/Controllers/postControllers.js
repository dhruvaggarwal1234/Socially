import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Post } from "../models/post.models.js";
import { User } from "../models/user.models.js";

import {v4 as uuid} from "uuid";
import { cloudinary } from "../utils/Cloudinary.js";
import fs from "fs";
import path from "path";


//==================================================== CREATE POST

//POST : api/posts
//Protected



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

  res.status(201).json({
    success: true,
    message: "Post created successfully",
    post: newPost,
  });
});





//==================================================== GET POST

//GET : api/posts/:id
//Protected

const getPost = asyncHandler( async (req ,res, next) => {
    const{id} = req.params;
    const post = await Post.findById(id).populate("creator").populate({path:"comments", options:{sort:{createdAt:-1}}})
    res.json(post)

})

//==================================================== GET POSTS

//GET : api/posts
//Protected

const getPosts = asyncHandler( async (req ,res, next) => {
    
    const posts = await Post.find().sort({createdAt:-1})
    res.json(posts)
})



//==================================================== UPDATE POST

//PATCH : api/post/:id
//Protected

const updatePost = asyncHandler(async (req, res) => {
  const postId = req.params.id;
  const { body } = req.body;

  const post = await Post.findById(postId);

  if (!post) {
    throw new ApiError(404, "Post not found");
  }

  // it check the user is the valid or not
  if (post.creator.toString() !== req.user.id) {
    throw new ApiError(403, "You can't update this post");
  }


  const updatedPost = await Post.findByIdAndUpdate(
    postId,
    { body },
    { new: true }
  );

  res.status(200).json({
    success: true,
    message: "Post updated successfully",
    post: updatedPost
  });
});




//==================================================== DELETE POST

//DELETE : api/post/:id
//Protected

const deletePost = asyncHandler(async (req, res) => {
  const postId = req.params.id;


  const post = await Post.findById(postId);

  if (!post) {
    throw new ApiError(404, "Post not found");
  }

  // checking for the valid user
  if (post.creator.toString() !== req.user.id) {
    throw new ApiError(403, "You are not allowed to delete this post");
  }

  //  Delete post
  await Post.findByIdAndDelete(postId);

  // delete form the User modeel too

  

    res.status(200).json({
    success: true,
    message: "Post deleted successfully",
  });
});




//==================================================== GET FOLLOWINGS POST

//GET : api/posts/following
//Protected


const followingPost = asyncHandler(async (req, res) => {

  // current user following list
  const user = await User.findById(req.user.id).select("following");

  // number of there following  posts
  const posts = await Post.find({
    creator: { $in: user.following }
  })
   

  res.status(200).json({
    success: true,
    count: posts.length,
    posts
  });
});



//==================================================== GET LIKE AND DISLIKE POST

//POST : api/posts/:id/like
//Protected


const likeDislike = asyncHandler(async (req, res) => {

  const postId = req.params.id;
  const userId = req.user.id;

  const post = await Post.findById(postId);

  if (!post) {
    throw new ApiError(404, "Post not found");
  }

  const isLiked = post.likes.includes(userId);

  if (!isLiked) {
    post.likes.push(userId);
    await post.save();

    return res.status(200).json({
      success: true,
      message: "Post liked",
      likesCount: post.likes.length
    });
  } else {
    post.likes.pull(userId);
    await post.save();

    return res.status(200).json({
      success: true,
      message: "Post disliked",
      likesCount: post.likes.length
    });
  }
});



//==================================================== GET FOLLOWINGS POST

//GET : api/users/:id/posts
//Protected

const usersPost = asyncHandler(async (req, res) => {

  const userId = req.params.id;

  const posts = await Post.find({ creator: userId })
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: posts,
    posts
  });
});

//==================================================== CREATE BOOK
//POST : api/posts/:id/bookmark
//Protected


const createBookmark = asyncHandler(async (req, res) => {

  const { id } = req.params; // postId
  const userId = req.user.id;

  const user = await User.findById(userId);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const bookmarks = user.bookmarks || [];
  const isBookmarked = bookmarks.includes(id);

  if (isBookmarked) {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $pull: { bookmarks: id } },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "Bookmark removed",
      bookmarks: updatedUser.bookmarks
    });

  } else {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $addToSet: { bookmarks: id } },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "Post bookmarked",
      bookmarks: updatedUser.bookmarks
    });
  }
});


//==================================================== User Bookmarks
//GET : api/users/bookmark
//Protected


const getUserBookmark = asyncHandler(async (req, res) => {

  const user = await User.findById(req.user.id)
    .populate({
      path: "bookmarks",
      options: { sort: { createdAt: -1 } }
    });

  res.status(200).json({
    success: true,
    count: user.bookmarks.length,
    bookmarks: user.bookmarks
  });
});


export {createPost , getPost ,getPosts , updatePost,deletePost,followingPost ,likeDislike ,usersPost , createBookmark ,getUserBookmark}