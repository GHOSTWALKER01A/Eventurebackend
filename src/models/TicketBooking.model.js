import mongoose, {Schema} from "mongoose";


const ticketbookingSchema= new Schema({

  eventid:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required:true
  },
  Userid:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  tickettype:{
    type:String
  },
  paymentstatus:{
    type: String,
    enum: ['Pending', 'Completed','Failed'],
    required: true
  },
  createdAt:{
    type:Date,
    default:Date.now
  }

},{timestamps:true})




export const TicketBooking= mongoose.model("TicketBooking",ticketbookingSchema)