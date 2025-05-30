import { Router } from "express";
import { Getdashboardstats } from "../controllers/admin.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";


const router = Router()


router.route('/admin').get(verifyJWT(['Admin']),Getdashboardstats)



export default router