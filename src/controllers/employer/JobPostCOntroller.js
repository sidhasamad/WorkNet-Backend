    //============================================================post job===========================================

  import mongoose from "mongoose";
  import jobPosts from "../../model/employer/JobPostSchema.js";
  export const jobPost = async (req, res) => {
    try {
      

      const {
        jobTitle,
        company_email,
        companyName,
        fullName,
        phonenumber,
        // location,
        details,
        // employmentType,
        company_description,

        // pay,
        benefits,
        jobDescription,
        rate,
        city,
        area,
        pincode,
        jobs_location,
        minPay,
        maxPay,
        email,
      } = req.body;
      if (
        !jobTitle ||
        !company_email ||
        !companyName ||
        !fullName ||
        !phonenumber ||
        // !location ||
        !details ||
        // !employmentType ||
        !company_description ||
        // !pay ||
        !benefits ||
        !jobDescription ||
        !city ||
        !area ||
        !rate ||
        !pincode ||
        !jobs_location ||
        !minPay ||
        !maxPay ||
        !email 
      ) {
        return res.status(400).json({ error: "All fields are required!" });
      }
      // const currentEmployer=req.params.id
      const currentEmployer=req.user.id
      console.log("\n\ncurrent emoloyer\n\n",currentEmployer)
      const jobPost = new jobPosts({
        jobTitle,
        company_email,
        companyName,
        fullName,
        phonenumber,
        details,
        company_description,
        benefits,
        jobDescription,
        rate,
        city,
        area,
        pincode,
        jobs_location,
        minPay,
        maxPay,
        email,
        employer:currentEmployer
        // location,
        // employmentType,
        // pay, 
      });
      console.log("emp",email);
      
      await jobPost.save()
      res.status(201)
      .json({success:true,message:'Job Added successfully!',jobPost})
    } catch (error) {
      console.error('Error adding job',error);
      res.status(500).json({error:'Internal server error'})
      
    }
  };
  //===============================================================get job post================================================================================

  export const getJobPost = async (req, res) => {
    try {
      const employerEmail = req.query.email;
      console.log(employerEmail);
      
      if (!employerEmail) {
        return res.status(400).json({ success: false, message: "Email is required" });
      }

      const jobs = await jobPosts.find({ email: employerEmail });

      res.status(200).json({
        success: true,
        message: 'Job fetched successfully',
        data: jobs,
      });

    } catch (error) {
      console.error("Error while fetching job", error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  };

  //=========================================================getJob by id======================================

  export const getJobId=async(req,res)=>{
    try{
      const {id}=req.params 
      if(!mongoose.Types.ObjectId.isValid(id)){
        return res 
        .status(400)
        .json({success:false,message:'Invalid id'})
      }
  

      const job=await jobPosts.findById(id)
      
      if(!job){
        return res 
        .status(400)
        .json({success:false,message:'job not found'})
      }
      res.status(200).json({success:true,data:job})
    }catch(error){
      res
      .status(500)
      .json({success:false,message:'server error',error:error.message})
    }
  }

  //=====================================================editJob======================================================

  export const JobEdit=async(req ,res)=>{
    try{
      const {id}=req.params 
      const updatedData=req.body;

      const updatedJobPost=await jobPosts.findByIdAndUpdate(id,updatedData,{new:true})
        
      if (!updatedJobPost) {
        return res.status(404).json({ message: 'Job post not found' });
      }
      res.status(200).json({message:'job post updated successfully!',data:updatedJobPost})
    }catch(error){
      console.error(error);
      res.status(500).json({message:'Error updating job posts',error:error.message})
      
    }
  }

  //==========================================================job delete========================================

  export const JobDelete=async(req,res)=>{
    try{
      const {id}=req.params;
      const deleteJobPost=await jobPosts.findByIdAndDelete(id);
      if(!deleteJobPost){
        return res.status(400).json({success:false,message:'Job post not found'})
        
      }
      res.status(200).json({success:true,message:'Post deleted successfully'})
    }catch(error){
      console.error(error);
      res.status(500).json({success:false,message:'Internal server error'})
      
    }
  }

