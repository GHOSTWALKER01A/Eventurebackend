import {Router} from "express"
import { Bookticket, Getticket } from "../controllers/ticketbooking.controller.js"
import { verifyJWT } from "../middlewares/auth.middleware.js"


const router = Router()



router.use(verifyJWT)

// path for Ticket

router.route('/ticketbook').post(verifyJWT,Bookticket);

router.route('/myticket').get(verifyJWT,Getticket)

export default router