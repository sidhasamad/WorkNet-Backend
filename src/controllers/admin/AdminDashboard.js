//==============================================Total employees============================================

import employerSchema from "../../model/employer/employerSchema.js"
import jobPosts from "../../model/employer/JobPostSchema.js"
import userSchema from "../../model/user/userSchema.js"

export const handleTotalEmployees=async(req ,res)=>{
  const totalEmployees=await userSchema.aggregate([{$count:'totalCount'}])
  if(!totalEmployees){
    return res 
    .status(400).json({success:false,message:'error while calculating total employees'})
  }
  return res 
  .status(200)
  .json({success:true,message:'Total employees',data:totalEmployees})
}

//==========================================totalEmployers=================================
export const handleTotalEmployers=async(req ,res)=>{
  const totalEmployers=await employerSchema.aggregate([{$count:'totalCount'}])
  if(!totalEmployers){
    return res 
    .status(400).json({success:false,message:'error while calculating total employees'})
  }
  return res 
  .status(200)
  .json({success:true,message:'Total employees',data:totalEmployers})
}
//===========================================totaljobPosts===============================
export const handleTotalJobPosts=async(req ,res)=>{
  const totalJobPosts=await jobPosts.aggregate([{$count:'totalCount'}])
  if(!totalJobPosts){
    return res 
    .status(400).json({success:false,message:'error while calculating total employees'})
  }
  return res 
  .status(200)
  .json({success:true,message:'Total employees',data:totalJobPosts})
}