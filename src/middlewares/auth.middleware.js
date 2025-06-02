import { User } from "../models/User.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken"



export const verifyJWT = (roles= ['Organizer','Admin', 'User']) =>{ return asyncHandler(async(req,res,next)=>{
  try {
    
      const token = req.cookies?.accesstoken || req.header("Authorization")?.replace( "Bearer", "")
  
     if (!token) {
      throw new ApiError(401, "UnAuthorized request")
     }
  
  
     const decodetoken =  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
  
  const user =  await User.findById(decodetoken?._id).select("-password -refreshtoken")
  
   if (!token) {
      throw new ApiError(401,"invalid token")
  }
  
   if (roles.length && !roles.includes(req.user.role)) {
        return res.status(403).json({ message: 'Access denied' });
      }


  req.user = user;
  
  next()


  } catch (error) {
    throw new ApiError(401, error?.messege || "Invalid access token")
  }
    

})}
