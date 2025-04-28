import jobPosts from "../../model/employer/JobPostSchema.js"
import jobApplication from "../../model/user/ApplyJobSchema.js"
import { sendEmail } from "../../utilis/sendEmail.js"

export const ApplyJob = async (req, res) => {
  try {
    console.log("hgg",req.body);
    const { name, email, phonenumber, jobId ,fresherOrExperienced,expectedCTC} = req.body;
    const resume = req.file?req.file.path:null;
    
    if (!name || !email || !phonenumber ||!resume || !jobId ||!fresherOrExperienced||!expectedCTC) {
      return res.status(400).json({ error: 'All fields are required.' });
    }

    const application = new jobApplication({
      name,
      email,
      phonenumber,
      resume,
      jobId,
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
