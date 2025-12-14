import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.models.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const protect = asyncHandler(async (req, res, next) => {
  let token;

  // 1️⃣ Get token from header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  // 2️⃣ No token
  if (!token) {
    throw new ApiError(401, "Unauthorized: No token provided");
  }

  // 3️⃣ Verify token
  const decoded = jwt.verify(token, process.env.JWT_TOKEN_SECRET);

  // 4️⃣ Get user from DB
  const user = await User.findById(decoded.id).select("-password");

  if (!user) {
    throw new ApiError(401, "Unauthorized: User not found");
  }

  // 5️⃣ Attach user to request
  req.user = user;

  next();
});

export { protect };
