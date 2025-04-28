import mongoose from "mongoose";

const jobPostSchema = new mongoose.Schema({
  jobTitle: String,
  company_email:String,
  companyName: String,
  fullName: String,
  phonenumber: String,
  location: String,
  details: String,
  employmentType: String,
  // pay: String,
  benefits: String,
  jobDescription: String,
  company_description: String,
  rate:String,
  city: String,
  area: String,
  pincode: String,
  jobs_location: String,
  minPay: String,
  maxPay: String,
  email: {
    type: String,
    required: true,
  },
  employer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Employer",
  }

});
const jobPosts=mongoose.model('jobPost',jobPostSchema)
export default jobPosts
