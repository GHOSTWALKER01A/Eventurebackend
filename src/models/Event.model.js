import mongoose,{Schema} from "mongoose";

const eventSchema = new Schema({

    title:{
        type:String,
        required:[ true, 'Title is required'],
        trim: true
    },
    category:{
        type: String,
        required: true
    },
    eventtype:{
        type: String,
        enum: ['Single','Recurring'],
        required: true
    },
    startdatetime:{
        type: Date,
        required: true
    },
    enddate:{
       type: Date,
       required:true
    },
    locationtype:{
        type:String,
        enum: ['Real','Virtual'],
        required: true
    },
    location:{
        type: String,
        required:true
    },
    bannerimage:{
        type: String,
        required:true
    },
    tickettype:{
      type: String,
      enum:['Free','Priced'],
      required:true
    },
    ticketprice:{
        type:Number,
        default:0

    },
    additionalinfo:{
        type: String,
    }



},{timestamps:true});

eventSchema.path('ticketprice').validate((value)=>{
    return this.tickettype !== 'Free' || value === 0;
 }, 'Ticket price must be 0 for free events'
);






export const Event= mongoose.model("Event",eventSchema)