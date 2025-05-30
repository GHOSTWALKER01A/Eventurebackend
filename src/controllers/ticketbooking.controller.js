import { TicketBooking } from "../models/TicketBooking.model.js";

import { Event } from "../models/Event.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";


const Bookticket = asyncHandler(async(req ,res)=>{

   try {
     const {eventid , tickettype} = req.body;
 
     const event = await Event.findById(eventid);
 
     if (!event) {
         throw new ApiError(404, "event not found for this ticket")
     }
 
     const existingticket = await TicketBooking.findOne({
         eventid,
         userId : req.user._id,
     });
     if (existingticket) {
         throw new ApiError(400, "Ticket is already Booked")
     }
 
     const Createticket = new TicketBooking({
         eventid,
         userid: req.user._id,
         tickettype,
         paymentstatus: event.tickettype === "Free" ? 'Complete' : "Pending",
     });
     await Createticket.save();
 
     return res.status(201).json(
         new ApiResponse(
             201,
             
             {Createticket},

             {message : "Ticket Booked For the Event"}
         )
     )
   } catch (error) {
     throw new ApiError(400, error?.message || "Ticket not Booked")

   }
        
});


const Getticket = asyncHandler(async(req , res )=>{
    try {
        const tickets = await TicketBooking.find({ 
            userid: req.user._id
         }).populate('eventid');
         
         return res.status(200).json(
            new ApiResponse(
                200,
                {tickets}
            )
         )
    } catch (error) {
        throw new ApiError(500, error?.message || "Please wait while Generating Ticket")
    }

})







export {
    Bookticket,
    Getticket
}









