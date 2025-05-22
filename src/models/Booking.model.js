import mongoose, {Schema} from "mongoose";


const bookingSchema= new Schema({

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




export const Booking= mongoose.model("Booking",bookingSchema)