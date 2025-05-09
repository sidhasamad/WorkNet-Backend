import { application } from "express";
import EmployerNotifications from "../../model/employer/employerNotificationSchema.js";
import jobApplication from "../../model/user/ApplyJobSchema.js";
import { sendEmail } from "../../utilis/sendEmail.js";
import jobPosts from "../../model/employer/JobPostSchema.js";
import InterviewSchedule from "../../model/employer/interviewSchema.js";
import notificationLengthSchema from "../../model/user/notificationLenSchema.js";

export const getApplicationEmployer = async (req, res) => {
  try {
    const { jobId } = req.params;
    console.log("Job ID from req.params:", jobId);

    const applications = await jobApplication
      .find({ jobId })
      .populate("employeeId", "name email phonenumber") // Show employee info
      .populate("jobId", "jobTitle"); // Show job title if needed

    res.status(200).json({ success: true, applicants: applications });
  } catch (error) {
    console.error("Error fetching applications:", error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

//=======================================approve and reject==============================
export const EmployeeAction = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    const application = await jobApplication
      .findById(id)
      .populate("employeeId")
      .populate("jobId");
    console.log("application", application);

    if (!application) {
      return res
        .status(404)
        .json({ success: false, message: "Application not found" });
    }
    const employeeId = application.employeeId;
    const userId = application._id;
    const jobTitle = application.jobId?.jobTitle || "N/A";
    const companyName = application.jobId?.companyName || "N/A";
    if (!employeeId._id || !userId) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Valid employee or user ID required",
        });
    }
    application.status = status;
    if (status === "Scheduled" && interviewDate) {
      application.interviewDate = new Date(interviewDate);  // Set interview date if status is "Scheduled"
    }
    await application.save();

    const message = `Your job application has been ${status}d.`;
    const notificationData = {
      userId: userId,
      employeeId: employeeId._id, // Ensure this is valid
      employeeName: application.employeeId?.name || "Unknown",
      status: status,
      message: message,
      jobDetails: jobTitle,
      companyName:companyName,
     };

    await EmployerNotifications.create(notificationData);

    await sendEmail(
      application.employeeId.email,
      `Applicatipn ${status}d.`,
      `Dear ${
        employeeId.name || "Applicant"
      },\n\nCongratulations! Your application for the position of ${
        application.jobId?.jobTitle || "N/A"
      } has been approved. We will contact you soon with the next steps.\n\nBest regards,\nJob Portal Team`
    );
    res.status(200).json({ message: `Application ${status} successfully` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server errror" });
  }
};

//=====================================notification============================
export const EmployerNotification = async (req, res) => {
  try {
    const notifications = await EmployerNotifications.find({
      userId: req.params.employeeId,
    }).sort({ timestamp: -1 });
    return res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ message: "Error fetching notification" });
  }
};
//=======================================getStatusFIlter===============================

export const filterStatus = async (req, res) => {
  try {
    const { status } = req.body;
    let query = {};

    if (status === "Approved" || "Rejected") {
      query.status = status;
    }
    const application = await EmployerNotification.find(query);
    res.status(200).json(application);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};


//======================================interview scheduling=====================================




export const scheduleInterview = async (req, res) => {
  // const { id } = req.body;  
  const { applicationId, interviewDate, interviewTime } = req.body;  

  try {
    const application = await jobApplication.findById(applicationId);
    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    // Create a new interview schedule
    const interviewSchedule = new InterviewSchedule({
      applicationId: application._id,
      interviewDate: new Date(interviewDate),
      interviewTime: new Date(interviewTime),
      interviewStatus: 'Scheduled',
    });

    // Save the interview schedule
    await interviewSchedule.save();
    application.status = "Scheduled";
    application.save()

    // Return the response with interview details
    return res.status(200).json({
      message: `Interview scheduled for ${application.name} successfully!`,
      interviewSchedule,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};


//============================================notificationlength=================================
export const notificationLength=async(req ,res)=>{
  try{
    const notificationLength=await notificationLengthSchema.find({userId:req.params.userId}).sort({ createdAt: -1 });
    res.json(notificationLength)
  }catch(error){
    res.status(500).json({ message: 'Failed to fetch notifications' });
  }
}
//=================================================get unread count=======================
export const getUnreadCount=async(req ,res)=>{
  try{
    const count=await notificationLengthSchema.countDocuments({userId: req.params.userId, status: 'unread'})
    res.json({count})
  }catch(error){
    res.status(500).json({ message: 'Failed to fetch count' });
  }
}
//=====================================================MarkOneAsRead=======================
export const getMarkOneAsRead=async(req ,res)=>{
  try{
    const markOne=await notificationLengthSchema.findByIdAndUpdate(req.params.id,{status:'read'})
    res.json({ message: 'Marked as read' ,markOne});
  }catch(error){
    res.status(500).json({ message: 'Failed to update notification' });
  }
}

//===================================================createNewNotification====================
export const newNotification=async(req ,res)=>{
  try{
    const createNotification=await notificationLengthSchema(req.body)
     await createNotification.save()
     res.status(201).json(notification);
  }catch(error){
    res.status(500).json({ message: 'Failed to create notification' });
  }
}