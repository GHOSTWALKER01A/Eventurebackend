import {Router} from "express"
import { newEvent, newPublicEvent,
    individualEvents,
    Eventupdate,
    DeleteEvent
 } from "../controllers/event.controller.js"

import { verifyJWT } from "../middlewares/auth.middleware.js";


const router = Router()


// Public routes

router.route("/events").get(newPublicEvent)
router.route("/eventsbyid").get(individualEvents)

// For Admin and organiser

router.route("/newevent").post(verifyJWT(['Organizer','Admin']), newEvent)

router.route("/updateevent").put(verifyJWT(['Organizer','Admin']),Eventupdate)

router.route("/deleteevent").delete(verifyJWT(['Organizer','Admin']), DeleteEvent)


export default router 

