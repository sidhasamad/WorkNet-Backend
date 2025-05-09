import EmployerNotifications from "../../model/employer/employerNotificationSchema.js";
import InterviewSchedule from "../../model/employer/interviewSchema.js";
import jobPosts from "../../model/employer/JobPostSchema.js"
import jobApplication from "../../model/user/ApplyJobSchema.js"
import { sendEmail } from "../../utilis/sendEmail.js"

export const ApplyJob = async (req, res) => {
  try {
    console.log("hgg",req.body);
    const { name, email, phonenumber, jobId ,fresherOrExperienced,expectedCTC,employeeId} = req.body;
    const resume = req.file?req.file.path:null;
    console.log("req.user in ApplyJob:", req.user);


    
    if (!name || !email || !phonenumber ||!resume || !jobId ||!fresherOrExperienced||!expectedCTC ) {
      return res.status(400).json({ error: 'All fields are required.' });
    }
    

    const application = new jobApplication({
      name,
      email,
      phonenumber,
      resume,
      jobId,
      employeeId:req.user._id,
      fresherOrExperienced,
      expectedCTC
    });
    
    await application.save();

    const job = await jobPosts.findById(jobId);    
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    const employerEmail = job.email;

    const emailHtml = `
      <h3>${name} applied for your job: ${job.jobTitle}</h3>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${phonenumber}</p>
      <p><strong>Resume:</strong> <a href="${resume}" target="_blank">View Resume</a></p>
      <p><string>fresherOrExperienced:</strong><a href="${fresherOrExperienced}" target="_blank"></a></p>
      <p><string>fresherOrExperienced:</strong><a href="${expectedCTC}" target="_blank"></a></p>
      `;

    await sendEmail(employerEmail, `New Application for ${job.jobTitle}`, emailHtml);

    return res.status(200).json({ success: true, message: 'Application submitted and email sent' });

  } catch (error) {
    console.error("Error in ApplyJob:", error.stack || JSON.stringify(error));
  return res.status(500).json({ success: false, message: 'Server error', error: error.message || error });
  }
};

//==========================================================getApliedJob===============================================================

export const getAppliedJobs=async(req ,res)=>{
  try{
    const employeeId=req.user.id;
    console.log("req.user",req.user);

    const applicationCount = await jobApplication.countDocuments({ employeeId });
    console.log("count",applicationCount);
    
    const application=await jobApplication
    .find({employeeId})
    .populate({
      path:'jobId',
      select:'jobTitle companyName createdAt jobs_location'
    })
    .sort({createdAt:-1})
    console.log("application",application);
    
    if(!application.length){
      return res.status(400).json({
        success:false,
        message:'No application found',
        data:{
          count:0,
          application:[]
        }
      })
    }

    

    
    const formattedApplications=application.map(app=>({
      applicationId:app._id,
      jobTitle:app.jobId?.jobTitle || 'Job not available',
      companyName:app.jobId?.companyName || 'N/A',
      location: app.jobId?.location || "N/A",
      appliedAt: app.appliedAt,
      fresherOrExperienced: app.fresherOrExperienced,
      expectedCTC: app.expectedCTC,
      resume: app.resume,
      jobs_location:app.jobs_location,
      scheduledDate: app.scheduledDate || null,
    }));
    
    return res 
    .status(200).json({
      success:true,
      message:"Applied job retreived successfully",
      data:{
        count:applicationCount,
        application:formattedApplications
      },
    });
  }catch(error){
    return res 
    .status(500)
    .json({
      message:'Internal server error',
      error:error.message || error,
    })
    
  }
}






//=========================================handleApprovalOrRejected===========================

// export const handleEmployeeStatus=async(req,res)=>{
//   try{
//     const {status,employeeId,employeeName,userId}=req.body;
//     if (!["Approved", "Rejected"].includes(status)) {
//       return res.status(400).json({ message: "Invalid status value" });
//     }
//     const newNotification = new EmployerNotifications({
//       userId,
//       employeeId,
//       employeeName,
//       status,
//       message: `Your job application has been ${status}.`,
//       timestamp: new Date(),
//     });
//     await newNotification.save();
//     res.status(200).json({message:'Notification sent successfully!'})
//   }catch(error){
//     res.status(500).json({message:'Internal server error'})
//   }
// }

export const handleEmployeeStatus = async (req, res) => {
  try {
    const { status, employeeId, employeeName, userId ,jobId} = req.body;
    console.log("entire body",req.body);
    
    console.log('handleEmployeeStatus - employeeId:', employeeId); // Debug
    if (!["Approved", "Rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    // const job=await jobPosts.findById(jobId) 
    
    // if (!job) {
    //   return res.status(404).json({ message: "Job not found" });
    // }
    const newNotification = new EmployerNotifications({
      userId,
      employeeId,
      employeeName,
      status,
      message: `Your job application has been ${status}.`,
      timestamp: new Date(),
      // jobDetails:job._id  
    });
    await newNotification.save();
    const populatedNotification = await EmployerNotifications.findById(newNotification._id).populate('jobDetails', 'jobTitle');
    res.status(200).json({ message: 'Notification sent successfully!',notifications:populatedNotification });
  } catch (error) {
    console.error('Error in handleEmployeeStatus:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


export const getNotifications = async (req, res) => {
  try {
    const employeeId = req.user?._id; // Use _id from req.user
    if (!employeeId) {
      return res.status(400).json({ message: 'Invalid user data' });
    }

    const notifications = await EmployerNotifications.find({ employeeId: employeeId.toString() })
      .sort({ timestamp: -1 });
    
    console.log("notification - backend", notifications)

    res.status(200).json(notifications);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
