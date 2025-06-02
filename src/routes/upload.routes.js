import { Router } from "express";
import { uploadbanner } from "../controllers/upload.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";





// path for banner upload

const router = Router()


router.use(verifyJWT)


router.route('/uploadbanner').post(verifyJWT(['Organizer', 'Admin']),

     

       uploadbanner
)






export default router