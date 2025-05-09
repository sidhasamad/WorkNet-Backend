import employerSchema from "../../model/employer/employerSchema.js";

export const employerProfile=async(req ,res)=>{
  try{
    const employerEmail=req.params.email;
    const employer=await employerSchema.findOne({email:employerEmail}).select('-password')
    if(!employer){
      return res 
      .status(404).json({message:'Profile not found'})
    }
    res.status(200).json(employer)
  }catch(error){
    return res 
    .status(500).json({message:'server error'})
  }
}
//============================================================================================================

export const UploadProfileEmployer = async (req, res) => {
  upload.single('EmployerProfile')(req, res, async (err) => {
    if (err) {
      return res.status(400).json({
        success: false,
        message: "Upload failed",
        error: err.message
      });
    }

    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "No file uploaded"
        });
      }

      const imageUrl = req.file.path;
      const employerId = req.params.id;

      const updatedEmployer = await employerSchema
        .findByIdAndUpdate(
          employerId,
          { images: imageUrl },
          { new: true }
        )
        .select("-password");

      if (!updatedEmployer) {
        return res.status(400).json({
          success: false,
          message: "Employer not found"
        });
      }

      res.status(200).json({
        success: true,
        message: "Profile picture uploaded successfully",
        data: updatedEmployer,
      });

    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Server error",
        error: error.message,
      });
    }
  });
};



//======================================updateemployerprofile=====================
// controllers/employerController.js

// Update employer profile
export const UpdateEmployerProfile = async (req, res) => {
  const { email } = req.params;
  const { name, companyName, Logo, location, phone } = req.body;

  // Validation: Ensure all required fields are provided
  if (!name || !companyName || !Logo || !location || !phone) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    // Find employer by email
    const employer = await employerSchema.findOneAndUpdate({ email });

    if (!employer) {
      return res.status(404).json({ message: "Employer not found" });
    }

    // Update employer fields
    employer.name = name;
    employer.companyName = companyName;
    employer.Logo = Logo;
    employer.location = location;
    employer.phone = phone;

    // Save updated employer
    const updatedEmployer = await employer.save();

    // Return updated employer
    res.status(200).json(updatedEmployer);
  } catch (error) {
    console.error("Error updating employer profile:", error);
    res.status(500).json({ message: "Server error" });
  }
};

