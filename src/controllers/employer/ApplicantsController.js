import jobApplication from "../../model/user/ApplyJobSchema.js";

export const getApplicationEmployer = async (req, res) => {
  try {
    const { jobId } = req.params;
    console.log("Job ID from req.params:", jobId);

    const applications = await jobApplication.find({ jobId })
      .populate('employeeId', 'name email phonenumber')  // Show employee info
      .populate('jobId', 'jobTitle'); // Show job title if needed

    res.status(200).json({ success: true, applicants: applications });
  } catch (error) {
    console.error('Error fetching applications:', error.message);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};
