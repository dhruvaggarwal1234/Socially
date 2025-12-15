import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.models.js";

import { asyncHandler } from "../utils/asyncHandler.js";

const authMiddleware = asyncHandler(async (req, res, next) => {

  const authHeader = req.headers.authorization;

  // 🛑 SAFETY CHECK
  if (typeof authHeader !== "string") {
    throw new ApiError(401, "Unauthorized. Authorization header missing");
  }

  if (!authHeader.startsWith("Bearer ")) {
    throw new ApiError(401, "Unauthorized. Invalid token format");
  }

  const token = authHeader.split(" ")[1];

  const decoded = jwt.verify(token, process.env.JWT_TOKEN_SECRET);

  const user = await User.findById(decoded.id).select("-password");

  if (!user) {
    throw new ApiError(401, "Unauthorized. User not found");
  }

  req.user = user;
  next();
});


export {authMiddleware}
