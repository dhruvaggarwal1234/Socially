import {asyncHandler} from "../utils/asyncHandler.js"
import { User } from "../models/user.models.js"
import bcrypt from "bcrypt"
import {ApiError} from "../utils/ApiError.js"
import  jwt from "jsonwebtoken"

//=================================Register User
// POST : api/users/register
//Unprotected
const registerUser = asyncHandler(async (req, res) => {
  const { fullname, email, password } = req.body;

  // 1️⃣ Validation
  if (!fullname || !email || !password) {
    throw new ApiError(422, "Fill all the details");
  }

  const lowerEmail = email.toLowerCase();

  // 2️⃣ Check duplicate email
  const emailExists = await User.findOne({ email: lowerEmail });
  if (emailExists) {
    throw new ApiError(409, "Email already exists");
  }

  // 3️⃣ Hash password
  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(password, salt);

  // 4️⃣ Create user
  const newUser = await User.create({
    fullname,
    email: lowerEmail,
    password: hashPassword
  });

  // 5️⃣ Response
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
    { id: user._id },
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
    const editUser = await user.findByIdAndUpdate(req.user.id, {fullname ,bio} ,{new:true})
    res.status(200).json({
        editUser
    })
})


//================================= fOLLOWUNFOLOWUSER
// PATCH : api/users/:id/follow-unfollow
//protected

const followUnfollowUser= asyncHandler(async (req,res) =>{

    res.json("FollowUnfollowUser")
})



//================================= CHANGEPROFILE
// PATCH : api/users/avatar
//protected

const ChangeProfile= asyncHandler(async (req,res) =>{

    res.json("ChangeUser")
})


export {ChangeProfile,followUnfollowUser,editUser,getUser,getUsers,loginUser,registerUser}