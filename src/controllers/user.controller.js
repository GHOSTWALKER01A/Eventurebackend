import {asyncHandler} from "../utils/asyncHandler.js"
import {ApiError} from "../utils/ApiError.js"
import { User } from "../models/User.model.js"
import { uploadoncloudinary } from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js"




const registerUser= asyncHandler(async (req, res)=>{
 

    // data from the user
    //validation of detail
    //check if user was register already
    //check if image is there 
    //upload it to cloudinary
    // create user object - entry in db
    //remove password and refresh token field from response
    // check for new user creation
    //return res


   const {username,email,password}=req.body
   console.log("email: ",email);

//    if (username === "") {
//     throw new ApiError(400,"fullname is required")
    
//    }

if ([
    username,email,password
].some((field)=> field?.trim() === ""))
     {
    throw new ApiError(400, "Fields are compulsary")
}
   
const existedUser = await User.findOne({
    $or:[{username},{email}]
})
if (existedUser) {
    throw new ApiError(400, "Account Already exist")
}

const profileimagepath = req.files?.profileimage[0]?.path;



if (!profileimagepath) {
    throw new ApiError(400,"profile image required")
}

const profileimage = await uploadoncloudinary(profileimagepath)
    
if (!profileimage) {
    throw new ApiError(400,"Image File required")
}

const user = await User.create({
    username:username.toLowerCase(),
    email,
    password,
    profileimage:profileimage.url
})

const createdUser = await User.findById(user._id).select(
    "-password -refreshtoken" 
)

if (!createdUser) {
    throw new ApiError(500, "Something went wrong on server")
}

return res.status(201).json(
    new ApiResponse(200,createdUser,"User Registered Successfully")
)









})




    


export {registerUser}