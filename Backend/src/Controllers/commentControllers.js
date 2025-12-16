import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Post } from "../models/post.models.js";
import { User } from "../models/user.models.js";
import { Comment } from "../models/comment.models.js";


//====================================================== Create Comment

//POST : api/comments/:postId
//PROTECTED

const createComment = asyncHandler(async (req, res) => {
  const { postId } = req.params;
  const { comment } = req.body;

  if (!comment) {
    throw new ApiError(422, "Please write a comment");
  }

  // check post exists
  const post = await Post.findById(postId);
  if (!post) {
    throw new ApiError(404, "Post not found");
  }

  //Get the comment and usre details

  const commentCreator = await User.findById(req.user.id);

  const newComment = await Comment.create({
    creator: {
      creatorId: req.user.id,
      creatorName: commentCreator.fullname,
      creatorPhoto: commentCreator.profilePhoto,
    },
    comment,
    postId,
  });

  // Update the in Mongodb

  await Post.findByIdAndUpdate(
    postId,
    { $push: { comments: newComment._id } },
    { new: true }
  );

  //Send the Response

  res.status(200).json({
    success: true,
    result: newComment,
  });
});



//====================================================== GET Comment

//GET : api/comments/:postId
//PROTECTED
const getComments = asyncHandler(async (req, res) => {
  
    // extract the id
  
    const { postId } = req.params;

  
  const post = await Post.findById(postId)
    .populate({
      path: "comments",
      options: { sort: { createdAt: -1 } },
    });

    //Post not Found
  if (!post) {
    throw new ApiError(404, "Post not found");
  }

  res.status(200).json({
    success: true,
    result: post.comments,
  });
});



//====================================================== Delete Comment

//DELETE : api/comments/:commentId
//PROTECTED
const deleteComment = asyncHandler(async (req, res) => {
  const { commentId } = req.params;

  // find comment
  const comment = await Comment.findById(commentId);
  if (!comment) {
    throw new ApiError(404, "Comment not found");
  }

  // check ownership
  if (comment.creator.toString() !== req.user.id) {
    throw new ApiError(403, "You are not allowed to delete this comment");
  }

  // remove comment from post
  await Post.findByIdAndUpdate(
    comment.postId,
    { $pull: { comments: comment._id } }
  );

  // delete comment
  await Comment.findByIdAndDelete(commentId);

  res.status(200).json({
    success: true,
    message: "Comment deleted successfully",
  });
});



export { getComments ,createComment,deleteComment};