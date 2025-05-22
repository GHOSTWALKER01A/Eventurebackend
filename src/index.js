
import express from "express";
import connectDB from "./db/index.js";
import dotenv  from "dotenv";

const app= express()


dotenv.config({
    path:'./env'
})

connectDB()

.then(()=>{
    app.listen(process.env.PORT || 6000, ()=>{
        console.log(`Server is running at PORT:${process.env.PORT}`);
        
    })
    app.on("error", (error)=>{
        console.log("ERROR: ",error);
        throw error
        
    })
})
.catch((err)=>{
    console.log("MONGODB Connection failed !!",err);
    
})

