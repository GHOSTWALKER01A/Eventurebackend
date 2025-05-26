import { User } from "../models/User.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken"



export const verifyJWT = asyncHandler(async(req,res,next)=>{
  try {
    
      const token = req.cookies?.accesstoken || req.header("Authorization")?.replace( "Bearer", "")
  
     if (!token) {
      throw new ApiError(401, "UnAuthorized request")
     }
  
  
     const decodetoken=  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
  
  const user =  await User.findById(decodetoken?._id).select("-password -refreshtoken")
  
   if (!token) {
      throw new ApiError(401,"invalid token")
  }
  
  req.user = user;
  next()


  } catch (error) {
    throw new ApiError(401, error?.messege || "Invalid access token")
  }
    

})
