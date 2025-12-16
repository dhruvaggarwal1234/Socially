import mongoose from "mongoose";

const { Schema, model } = mongoose;

const commentSchema = new Schema(
  {
    creator: {
      creatorId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      creatorName: {
        type: String,
        required: true,
      },
      creatorPhoto: {
        type: String,
      },
    },

    postId: {
      type: Schema.Types.ObjectId,
      ref: "Post",
      required: true,
    },

    comment: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);


export const Comment = model("Comment", commentSchema);
