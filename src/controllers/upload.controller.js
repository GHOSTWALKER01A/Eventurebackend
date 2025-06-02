import { Upload } from "../models/Uploads.model.js";
import { upload } from "../middlewares/multer.middleware.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";



const uploadbanner = [upload.single('banner'), asyncHandler(async(req , res)=>{

  try {
      if (!req.file) {
          throw new ApiError(400, "File not Uploaded")
      }
  
      const newupload = new Upload({
          filename: req.file.filename,
          path:`./public/temp/${req.files.filename} `,
          type: req.file.mimetype,
          associatedevent: req.body.eventid
      });
      await newupload.save()
      return res.status(200).json(
          new ApiResponse(
              200,
              {
                  filePath: newupload.path
              }
          )
      )
  } catch (error) {
    
    throw new ApiError(500 , error?.message || "Banner not Uploaded")
  }


})
]

export {
    uploadbanner
}