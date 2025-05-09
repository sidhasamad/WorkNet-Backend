import mongoose from "mongoose";

const userschema = new mongoose.Schema(
  {
    googleId:{
      type:String,
      // required:true,
    },
    name: {
      type: String,
      // required: true,
    },
    email: {
      type: String,
      // required: true,
    },
    password: {
      type: String,
      // required: true,
    },
    phoneNumber: {
      type: String,
      // required: true,
    },
    images:{
       type:String
    },
    role: {
      type: String,
      enum: ["user", "employer", "admin"],
      default: "user",
    },
    savedJobs:[
      {
        type:mongoose.Schema.Types.ObjectId,ref:'jobPost'
      }
    ],
    linkedIn:{
      type:String,
      default:""
    },
    github:{
      type:String,
      default:""
    },
    status: { type: String, default: 'Pending' },

    
    otp: { type: Number },
    otpExpiry: { type: Date },

    resetToken: {type: String,default: null  },

    resetTokenExpiry: {type: Date,default: null  },
  },
  { timestamps: true }
);
const userSchema = mongoose.model("users", userschema);
export default userSchema;
