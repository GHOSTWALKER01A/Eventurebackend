import {Event} from "../models/Event.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"


const newEvent = asyncHandler(async(req, res)=>{
    try {
         const event = new Event(req.body)
         
         if (!event) {
            throw new ApiError(400, "No Event Found")
            
         }
         event.createdBy = req.user._id
         await event.save()
         return res.status(200).json( 
            new ApiResponse(
                200,
                {event}
            )
         )
    } catch (error) {
        throw new ApiError(500, "No new event found")
    }
})


const newPublicEvent = asyncHandler(async(req, res)=>{
     try {
        const event = await Event.find()
   
        if (!event) {
           throw new ApiError(401, "No Public event found")
        }
        
        return res.status(200).json(
           new ApiResponse(
               200,
               {event}
           )
        )
     } catch (error) {
        throw new ApiError(500, "Public Event not Found")
     }


     
})

const individualEvents = asyncHandler(async(req , res)=>{
   try {
      
     const event = await Event.findById(req.params._id);
     
     if (!event) {
         throw new ApiError(404, "Event by id not Found")
 
     }
     return res.status(200).json(
         new ApiResponse (
             200,
             {event},
             {messege: "Individual event found"}
         )
     )
   } catch (error) {
    throw new ApiError(500, error?.message || "Individual id Event not found")
   }
})


const Eventupdate = asyncHandler(async(req , res)=>{
   try {
     const event = await Event.findByIdAndUpdate(req.params._id, req.body, {
         new: true
     })
     
     if (!event) {
         throw new ApiError(200, "Event not present")
 
     }
 
     return res.status(200).json(
         new ApiResponse(
             200,
             {event}
         )
     )
   } catch (error) {
      throw new ApiError(501, error?.message || "Server not found the image")
   }

})


const DeleteEvent = asyncHandler(async(req , res)=>{
   try {
     const event = await Event.findByIdAndDelete(req.params._id);
 
     if (!event) {
         throw new ApiError(401, "No Event is present")
     }
         
     return res.status(200 , "Event deleted").json(
         new ApiResponse(
             200,
             {event}
         )
     )
   } catch (error) {
    throw new ApiError(500, error?.message || "Event cannot be deleted")
   }
})
















export {
    newEvent,
    newPublicEvent,
    individualEvents,
    Eventupdate,
    DeleteEvent

}