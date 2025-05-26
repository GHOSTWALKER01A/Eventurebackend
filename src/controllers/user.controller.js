import {asyncHandler} from "../utils/asyncHandler.js"
import {ApiError} from "../utils/ApiError.js"
import { User } from "../models/User.model.js"
import { uploadoncloudinary } from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import jwt from "jsonwebtoken"




const generateAccessandRefreshtoken = async(userId)=>{
    try {
       const user =  await User.findById(user._Id)
       const refreshtoken = user.generateRefreshToken()
       const accesstoken = user.generateAccessToken()

       user.refreshtoken = refreshtoken
       await user.save({validatebeforesave: false})

    return {accesstoken,refreshtoken}

    } catch (error) {
        throw new ApiError(500,"something went wrong using refresh ans access token generation")
    }
}

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


   const {username,email,password} = req.body
   console.log("email: ",email);

//    if (username === "") {
//     throw new ApiError(400,"fullname is required")
    
//    }

if ([
    username,email,password
] .some((field)=> field?.trim() === ""))
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

const loginUser= asyncHandler(async(req,res)=>{
        // req.body
        //username or email
        // find the user
        // password check
        //access and refresh token
        // send secure cookies


    const {username,email,password} = req.body

    if (!( username || password )) {
        throw new ApiError(400,"Username and Email is required")
    }
    
   const user = User.findOne({
        $or:[{username},{email}]
    })
    if (!user) {
        throw new ApiError(404,"User not found")
    }
        
  const isPasswordvalid = await user.isPasswordCorrect(password)
      if (!isPasswordvalid) {
        throw new ApiError(401,"invalid user detail")
      }
      
      const {accesstoken,refreshtoken} = await generateAccessandRefreshtoken(user._id)

    const loggedInUser = await User.findById(user._id).select("-password  -refreshtoken")

    const options = {
        httpOnly: true,
        secure: true
    }

    return res.status(200).
    cookie("accessToken", accesstoken,options).
    cookie("refreshToken", refreshtoken,options).
    json(
        new ApiResponse(
            200,
            {
                user: loggedInUser,accesstoken,refreshtoken
            },
            "User Logged In Successfully"
        )
    )



})  

const logoutUser = asyncHandler(async(req,res)=>{
    User.findByIdAndUpdate(
        req.user._id,
        {
            $set:{
                refreshtoken: undefined
            }
        },
        {
            new: true
        }
    )
    
    const options = {
        httpOnly: true,
        secure: true
    }

    return res.status(200)
    .clearcookie("accesstoken",options)
    .clearcookie("refreshtoken",options)
    .json(new ApiResponse (200,{}, "User logged out"))
})

const refreshAccesstoken = asyncHandler(async(req,res)=>{
    const incomingrefreshtoken = req.cookies.refreshtoken || req.body.refreshtoken

   if (!incomingrefreshtoken) {
    throw new ApiError(400,"invalivalid request" )
}

try {
    const decodedtoken = jwt.verify(
        incomingrefreshtoken,
        process.env.REFRESH_TOKEN_SECRET
    )
      
    const user = await User.findById(decodedtoken?._id)
    
    
     if (!user) {
        throw new ApiError(401,"Invalid refresh token")
        
     }
    
    if (incomingrefreshtoken !== user?.refreshtoken) 
        {
    throw new ApiError(401, "Refresh token is expired")    
    }
    
    
    const options = {
        httpOnly: true,
        secure: true
    }
    
    const {accesstoken,newrefreshtoken} = await generateAccessandRefreshtoken(user._id)
    
    return res.status(200)
    .cookie("accesstoken", accesstoken,options)
    .cookie("refreshtoken",newrefreshtoken,options)
    .json(
        new ApiResponse(
            200,
            {accesstoken, refreshtoken: newrefreshtoken}
        )
    )
} catch (error) {
    throw new ApiError(400 , error?.message || "Invalid refresh token")
}

})


const changecurrentpassword = asyncHandler(async(req,res)=>{
    const {oldPassword,newPassword} = req.body

   const user = await User.findById(req.user?._id)
   const isPasswordCorrect = await  user.isPasswordCorrect(oldPassword)

   if (!isPasswordCorrect) {
    throw new ApiError(400, "invalid old password")
}

user.password = newPassword
await user.save({validatebeforesave: false})

return res.status(200)
.json(new ApiResponse(200,{}, "Password changed successfully"))

    
})

const getcurrentuser = asyncHandler(async(req, res)=>{
    return res.status(200)
    .json(new ApiResponse(200,req.user, "current user fetched"))
})

const updateAccountdetails = asyncHandler(async(req,res)=>{
    const {username,email}= req.body

    if (!username || !email) {
        throw new ApiError(400, "All field required")
        
    }

    const user = await  User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                username,
                email: email
            }
        },
        {new:true}
    ).select("-password")

    return res.status(200)
    .json(new ApiResponse(200,user ,"Account details updated successfully"))

})


const updateUserprofileimage = asyncHandler(async(req,res)=>{
    const profileimagelocalpath = req.files?.path

    if (!avatarlocalpath) {
        throw new ApiError(400, "Profile image is missing")
    }

    const Profileimage = await uploadoncloudinary(profileimagelocalpath)

    if (!Profileimage.url) {
        throw new ApiError(400, "Profile image is not uploading")
    }

   const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set:{
                profileimage: Profileimage.url
            }
        },
        {new: true}
    ).select("-password")

    return res.status(200)
    .json(new ApiResponse(200,user,"Profile image updated"))
        
})








export {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccesstoken,
    changecurrentpassword,

    updateAccountdetails,
    updateUserprofileimage,
    getcurrentuser

}