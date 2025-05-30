import express from "express";
import cookieParser from "cookie-parser";
import cors from  "cors";





const app = express()

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    Credentials: true
}))




app.use(express.json({limit: '16kb'}))
app.use(express.urlencoded({extended:true, limit: '16kb'}))
app.use(express.static('public'))
app.use(cookieParser())



 //  routes

import userRouter from "../src/routes/user.routes.js"
import eventRouter from "../src/routes/event.routes.js"
import ticketbookingRouter from "../src/routes/ticketbooking.routes.js"
import uploadRouter from "../src/routes/upload.routes.js"
import adminRouter from "../src/routes/admin.routes.js"


// direction

app.use("/api/v1/users", userRouter)
app.use("/api/vi/events",eventRouter)
app.use("/api/vi/ticketbookings",ticketbookingRouter)
app.use("/api/vi/uploads",uploadRouter)
app.use("/api/vi/admin",adminRouter)


export {app}