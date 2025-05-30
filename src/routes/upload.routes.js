import { Router } from "express";
import { uploadbanner } from "../controllers/upload.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";





// path for banner upload

const router = Router()


router.route('/uploadbanner').post(verifyJWT(['Organizer', 'Admin']),

      upload.fields([
             {
                 name:"type", 
                 maxCount: 1
             }
         ]),

       uploadbanner
)






export default router