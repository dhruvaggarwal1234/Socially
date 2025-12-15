import mongoose from "mongoose";

const postSchema = new mongoose.Schema({

    creator :{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
     body :{
        type:String,
        required:true,
     },

    image :{
        type:String,
        required:true,
     },

    likes :[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }],

    comments :[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Comment"
    }],

},{timestamps:true})

export const Post = mongoose.model("Post" , postSchema);