import { Router } from "express";
import { loginUser, logoutUser, refreshAccesstoken,changecurrentpassword,

    updateAccountdetails,
    updateUserprofileimage,
    getcurrentuser, registerUser } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router()



router.route("/register").post(
    
    upload.fields([
        {
            name:"profileimage", 
            maxCount: 1
        }
    ]),

    registerUser
)

router.route("/login").post(loginUser)

router.route("/logout").post(verifyJWT,logoutUser)

router.route("/refresh-token").post(refreshAccesstoken)

router.route("/change-password").post(verifyJWT, changecurrentpassword)
router.route("/current-user").get(verifyJWT, getcurrentuser)
router.route("/update-account").patch(verifyJWT, updateAccountdetails)

router.route("/profileimage").patch(verifyJWT, upload.single("avatar"), updateUserprofileimage)








export default router