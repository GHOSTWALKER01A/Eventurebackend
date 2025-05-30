import mongoose, {Schema} from "mongoose";

const uploadSchema= new Schema({

       filename:{
             type:String,
             required:true
         },
         path:{
             type:String,
             required:true
         },
         type:{
             required:true,
             type: String
         },
         associatedevent:{
             type:mongoose.Schema.Types.ObjectId,
             ref:' Event',
             required: true
         }

         
},{timestamps: true})






export const Upload = mongoose.model("Upload",uploadSchema)