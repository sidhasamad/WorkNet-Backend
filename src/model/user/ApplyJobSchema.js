import mongoose from "mongoose";

const applyJobSchema=new mongoose.Schema({
  name:{
    type:String,
    required:true
  },
  email:{
    type:String,
    required:true
  },
  phonenumber:{
    type:String,
    required:true
  },
  resume:{
    type:String,
    required:true
  },
  jobId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'jobPost',
    required:true
  },
  employeeId:{
     type:mongoose.Schema.Types.ObjectId,
     ref:'users',
  },
  fresherOrExperienced: {  
    type: String,
    enum: ['Fresher', 'Experienced'],  
    required: true,  
  },
  expectedCTC: {  
    type: Number,  
    required: true,  
  },

  appliedAt:{
    type:Date,
    default:Date.now()
  },
  status: {
    type: String,
    enum: ["Pending", "Approved", "Rejected","Scheduled"],
    default: "Pending",
  },
  

})
const jobApplication=mongoose.model('JobApplication',applyJobSchema)
export default jobApplication;



