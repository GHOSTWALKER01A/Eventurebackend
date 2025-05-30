import { Event } from "../models/Event.model.js";
import { TicketBooking } from "../models/TicketBooking.model.js";
import { User } from "../models/User.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";




const Getdashboardstats = asyncHandler(async(req, res)=>{
    try {
        
      const totalevents = await Event.countDocuments();
      const totalusers = await User.countDocuments();
      const revenue = await TicketBooking.aggregate([
        {
            $match:{
                paymentstatus: 'Complete'
            }
        },
        {
            $lookup:{
                from: 'events',
                localField: 'eventid',
                foreignField: "_id",
                as: 'event'
            },
        },
        { $unwind: '$event'},
        { $group : { _id: null, total: {$sum: '$event.ticketprice'}}}

      ]) ;

      return res.status(200).json(
        200,
        {
            totalevents,
            totalusers,
            totalrevenge: revenue[0]?.total || 0
        })




    } catch (error) {
        throw new ApiError(500, error?.message || "Fetching details")
    }
})

export {
    Getdashboardstats
}