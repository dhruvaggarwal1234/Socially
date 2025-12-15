import {asyncHandler} from "../utils/asyncHandler.js"
import { User } from "../models/user.models.js"
import bcrypt from "bcrypt"
import {ApiError} from "../utils/ApiError.js"
import  jwt from "jsonwebtoken"
import fs from "fs";
import path from "path";
import { v4 as uuid } from "uuid";





//=================================Register User
// POST : api/users/register
//Unprotected
const registerUser = asyncHandler(async (req, res) => {
  const { fullname, email, password } = req.body;

  //  Validation
  if (!fullname || !email || !password) {
    throw new ApiError(422, "Fill all the details");
  }

  const lowerEmail = email.toLowerCase();

  // Check duplicate email
  const emailExists = await User.findOne({ email: lowerEmail });
  if (emailExists) {
    throw new ApiError(409, "Email already exists");
  }

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(password, salt);

  // Create user
  const newUser = await User.create({
    fullname,
    email: lowerEmail,
    password: hashPassword
  });

  // Response
  res.status(201).json({
    success: true,
    message: "User registered successfully",
    user: {
      id: newUser._id,
      fullname: newUser.fullname,
      email: newUser.email
    }
  });
});


//=================================login User
// POST : api/users/login
//Unprotected


const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  //  Validation
  if (!email || !password) {
    throw new ApiError(422, "Fill all the details");
  }

  const lowerEmail = email.toLowerCase();

  //  Find user + include password
  const user = await User
    .findOne({ email: lowerEmail })
    .select("+password");

  if (!user) {
    throw new ApiError(401, "Invalid credentials");
  }

  //  Compare password
  const isPasswordMatch = await bcrypt.compare(password, user.password);
  if (!isPasswordMatch) {
    throw new ApiError(401, "Invalid credentials");
  }

  //  Generate tokens
  const accessToken = jwt.sign(
    { id:user._id },
    process.env.JWT_TOKEN_SECRET,
    { expiresIn: process.env.TOKEN_EXPIRY || "15m" }
  );

  const refreshToken = jwt.sign(
    { id: user._id },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: process.env.REFRESH_EXPIRY || "7d" }
  );

  //  Remove password before response
  const { password: _, ...userInfo } = user.toObject();

  // Send response
  res.status(200).json({
    success: true,
    message: "Login successful",
    accessToken,
    refreshToken,
    user: userInfo
  });
});




//================================= Get USer
// GET : api/users/:id
//protected

const getUser= asyncHandler(async (req,res) =>{

    const {id} = req.params;
    const user = await User.findById(id)
    if(!user){
        throw new ApiError(401 , "Invalid Credentials")
    }
    res.status(200).json(user)
})


//================================= Get USers
// GET : api/users
//protected

const getUsers= asyncHandler(async (req,res) =>{

    const user = await User.find().limit(10).sort({createdAt: -1})
    res.status(200).json(user)
})


//================================= EDIT Users
// PATCH : api/users/edits
//protected

const editUser= asyncHandler(async (req,res) =>{

    const {fullname , bio} = req.body;
    const editUser = await User.findByIdAndUpdate(req.user.id, {fullname ,bio} ,{new:true})
    res.status(200).json({
        editUser
    })
})


//================================= fOLLOWUNFOLOWUSER
// Get : api/users/:id/follow-unfollow
//protected

const followUnfollowUser = asyncHandler(async (req, res) => {

  const userToFollowId = req.params.id;
  const currentUserId = req.user.id;

  if (currentUserId === userToFollowId) {
    throw new ApiError(422, "You can't follow yourself");
  }

  const currentUser = await User.findById(currentUserId);
  const isFollowing = currentUser.following.includes(userToFollowId);

  if (!isFollowing) {
    const updatedUser = await User.findByIdAndUpdate(
      userToFollowId,
      { $addToSet: { followers: currentUserId } },
      { new: true }
    );

    await User.findByIdAndUpdate(
      currentUserId,
      { $addToSet: { following: userToFollowId } }
    );

    return res.status(200).json({
      success: true,
      message: "User followed successfully",
      user: updatedUser
    });

  } else {
    const updatedUser = await User.findByIdAndUpdate(
      userToFollowId,
      { $pull: { followers: currentUserId } },
      { new: true }
    );

    await User.findByIdAndUpdate(
      currentUserId,
      { $pull: { following: userToFollowId } }
    );

    return res.status(200).json({
      success: true,
      message: "User unfollowed successfully",
      user: updatedUser
    });
  }
});





//================================= CHANGE PROFILE
// PATCH : api/users/avatar
// protected
const ChangeProfile = asyncHandler(async (req, res) => {

  if (!req.files || !req.files.avatar) {
    throw new ApiError(400, "Avatar file is required");
  }

  const avatar = req.files.avatar;

  // size limit (2MB)
  const MAX_SIZE = 2 * 1024 * 1024;
  if (avatar.size > MAX_SIZE) {
    throw new ApiError(422, "Image size should be less than 2MB");
  }

  // allowed types
  const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
  if (!allowedTypes.includes(avatar.mimetype)) {
    throw new ApiError(422, "Only image files are allowed");
  }

  // create uploads folder if not exists
  const uploadDir = path.join(process.cwd(), "uploads");

  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  // unique filename
  const ext = path.extname(avatar.name);
  const newFileName = `avatar-${req.user.id}-${uuid()}${ext}`;
  const uploadPath = path.join(uploadDir, newFileName);

  // move file
  await avatar.mv(uploadPath);

  // save to DB
  const updatedUser = await User.findByIdAndUpdate(
    req.user.id,
    { profilePhoto: `/uploads/${newFileName}` },
    { new: true }
  );

  const { password, ...safeUser } = updatedUser.toObject();

  res.status(200).json({
    success: true,
    message: "Avatar uploaded successfully",
    user: updatedUser
  });
});




export {ChangeProfile,followUnfollowUser,editUser,getUser,getUsers,loginUser,registerUser}