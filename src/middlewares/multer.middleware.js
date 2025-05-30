 import multer from "multer";
import { ApiError } from "../utils/ApiError.js";


const storage = multer.diskStorage({
    destination: function (req,file,cb) {
        cb(null,"./public/temp")
    },
    filename: function(req,file,cb){
        cb(null,`${Date.now()}-${file.originalname}`)
    }
})

const Uploadfile = multer({
    storage,
    fileFilter: (ereq, file, cb)=>{
        const filetype = ['image/jpeg' , 'image/png']
    
        if (!filetype.includes(file.mimetype)) {
          return new cb ( ApiError(404, "Only JPG AND PNG File are allowed"))
        }
       cb (null , true)     
    
    
    }

})



export const upload = multer({
    storage,
    Uploadfile
})