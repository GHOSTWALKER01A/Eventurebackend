import mongoose, {Schema} from "mongoose";


const userSchema= new Schema({

    username:{
        type: String,
        required: [true, 'Full name required'],
        trim: true,
        // index: true
    },
    email:{
        type: String,
        required: [true, 'Email is required'],
        trim: true,
        unique: true
    },
    password:{
      type: String,
      required: [true, 'Password is required']
    
    },

    profileimage: {
        type: String,
        required:true
    },
    role: {
    type: String,
    enum: ['Admin', 'Organizer', 'Attendee'],
    default: 'Attendee',
  },


},{timestamps:true})







export const User = mongoose.model("User",userSchema)