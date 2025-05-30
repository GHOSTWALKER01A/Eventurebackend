import mongoose, {Schema} from "mongoose";
import bcrypt from "bcrypt"
import jwt  from "jsonwebtoken";




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
        required:[true, "Image file required"]
    },
    refreshtoken:{
     type: String
    },
    role: {
    type: String,
    enum: ['Admin', 'Organizer', 'Attendee'],
    default: 'Attendee',
  },


},{timestamps:true})


userSchema.pre("save", async function (next) {
    if(!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 10)
  next()    

})
userSchema.methods.isPasswordCorrect = async function (password) {
   return await bcrypt.compare(password, this.password)
    
}

userSchema.methods.generateAccessToken = function(){
   return jwt.sign(
        {
            _id: this._id,
            email:this.email,
            username:this.userSchema,
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}
userSchema.methods.generateRefreshToken = function(){
   return jwt.sign(
        {
            _id: this._id,
           
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )


}





export const User = mongoose.model("User",userSchema)