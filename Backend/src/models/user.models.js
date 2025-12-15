import mongoose ,{Schema} from "mongoose"

const userSchema = mongoose.Schema({

    fullname:{
        type:String,
        required:true,
        minlength : 6,
        trim:true,
    },

    email:{
        type :String,
        required:true,
        unique: true,
        trim:true,

    },

    password :{

        type:String,
        required:true,
        minlength:8,
    },

    profilePhoto:{
        type : String,
        default:"https://res.cloudinary.com/dwy2cyw8q/image/upload/v1765691685/deafult_pic_lgrqpq.jpg",

    },

    bio:{
        type:String,
        default:"no bio yet",
    },

    followers:[{
        type : Schema.Types.ObjectId ,
        ref : "User"
    }],

    following :[{
        type : Schema.Types.ObjectId,
        ref : "User"
    }] ,

    bookmarks :[{
         type : Schema.Types.ObjectId,
        ref : "Post",
        default:[]
    }],

    posts :[{
         type : Schema.Types.ObjectId,
        ref : "Post"
    }],

    saveUsers :[{
        type : Schema.Types.ObjectId,
        ref :"User"
    }]

},{timestamps:true})

export const User = mongoose.model("User" , userSchema);