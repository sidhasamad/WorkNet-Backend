import mongoose from "mongoose";
const employerschema=new mongoose.Schema(
  {
    name:{
      type:String,
      required:true,
    },
    companyName:{
      type:String,
      required:true
    },
    Logo:{
      type:String,
      required:true
    },
    location:{
      type:String,
      required:true
    },
    email:{
      type:String,
      required:true
    },
    phone:{
      type:String,
      required:true
    },
    password:{
      type:String,
      required:true
    }
  }
)
const employerSchema=mongoose.model('Employer',employerschema)
export default employerSchema