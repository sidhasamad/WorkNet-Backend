import mongoose from "mongoose";
import jobPosts from "../../model/employer/JobPostSchema.js";
import employerSchema from "../../model/employer/employerSchema.js";

export const getUserJob = async (req, res) => {
  try {
    const { location, salary, jobTitle } = req.query;
    const filters = {};
    if (location) filters.location = location;
    if (salary) filters.salary = { $gte: salary };
    if (jobTitle) filters.jobTitle = {$regex:jobTitle ,$options:"i"};
    const getAllJob = await jobPosts.find(filters).populate({
      path: "employer",
      model: "Employer",
      select: "Logo",
    });

    res
      .status(200)
      .json({ success: true, message: "Get all jobs", data: getAllJob });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

//===========================================================getuserJobDetails===============================

export const getUserJobId = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid id" });
    }
    const job = await jobPosts.findById(id);

    if (!job) {
      return res.status(400).json({ success: false, message: "Job not found" });
    }
    res.status(200).json({ success: true, message: "Job Details", data: job });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
//==========================================getJobsFIlter==========================
