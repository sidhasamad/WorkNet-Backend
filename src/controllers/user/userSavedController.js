import mongoose from "mongoose"
import jobPosts from "../../model/employer/JobPostSchema.js"
import userSchema from "../../model/user/userSchema.js"

export const userSave=async(req ,res)=>{
  const userId=req.user.id
  console.log("userid",userId);
  console.log("req",req);
  
  
  const jobId=req.params.id
  try{
    if(!mongoose.Types.ObjectId.isValid(jobId)){
      return res 
      .status(400).json({success:false,message:'Invalid job post'})
    }
    const job=await jobPosts.findById(jobId)
    if(!job){
      return res 
      .status(400)
      .json({success:false,message:'job not found'})
    }
    const user=await userSchema.findById(userId)
    console.log("loggin user",user)
  
    const alreadySaved = user.savedJobs?.some(id => id.toString() === jobId.toString());
    if(alreadySaved){
    return res 
    .status(200)
    .json({success:true,message:'Job already saved'})
   }
   user.savedJobs.push(jobId)
   await user.save()

   return res 
   .status(200).json({success:true,message:'Job saved successfully',data:user.savedJobs})
  }catch(error){
     console.error('Error saving job',error);
     return res 
     .status(500)
     .json({success:false,message:'Internal server error'})
  }  
}
//==========================================================getusersave====================================
export const getuserSave=async(req ,res)=>{
   const userId=req.user.id
   console.log("userid",req);
   
   try{
    // const user=await userSchema.findById(userId).populate({
    //   path:'savedJobs',
    //   model: 'jobPost', 
    //     path: 'employer',
    //     model: 'Employer',
    //     select: 'Logo',
    // })
    const user = await userSchema.findById(userId).populate({
      path: 'savedJobs',
      model: 'jobPost', // ✅ use correct model name: 'jobPost' not 'jobPosts'
      populate: {
        path: 'employer',
        model: 'Employer',
        select: 'Logo', // fetch only Logo (you can add more fields if needed)
      },
    });
    if(!user){
      return res 
      .status(400)
      .json({success:false,message:'user not find'})
    }
    return res 
    .status(200)
    .json({success:true,message:'saved job fetched successfully',data:user.savedJobs})
   }catch(error){
    return res 
    .status(500)
    .json({success:false,message:'Internal server error'})
   }
}

//=======================================deletesaved post=====================================

export const savedDelete=async(req ,res)=>{
  try{
    const {id}=req.params;
    console.log("id",id);
    
    const deleteSavedPost=await userSchema.findByIdAndDelete(id);
    if(!deleteSavedPost){
      return res 
      .status(200)
      .json({success:false,message:'no saved post'})
    }
    return res 
    .status(200)
    .json({message:true,success:'Saved post deleted',})
  }catch(error){
    console.error(error);
    res.status(500).json({success:false,message:'Internal server error'})
    
  }
}