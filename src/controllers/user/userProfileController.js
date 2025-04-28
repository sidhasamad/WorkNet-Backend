import { upload } from "../../../config/cloudinary.js";
import { errorHandler } from "../../middleware/errorHandling.js";
import jobApplication from "../../model/user/ApplyJobSchema.js";
import userSchema from "../../model/user/userSchema.js";

export const EmployeeProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    console.log("userId", userId);

    const existingUser = await userSchema.findById(userId).select("-password");
    console.log("exist", existingUser);

    if (!existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    }
    return res
      .status(200)
      .json({
        success: true,
        message: "Profile retrieved successfully",
        data: existingUser,
      });
  } catch (error) {
    return res
      .status(500)
      .json({
        success: false,
        message: "Internal server error",
        error: error.message,
      });
  }
};

//========================for uploading prfolie picture================================================
export const UploadProfilePicture = async (req, res) => {
  upload.single("profilePicture")(req, res, async (err) => {
    if (err) {
      return res
        .status(400)
        .json({ success: false, message: "Upload failed", error: err.message });
    }

    try {
      if (!req.file) {
        return res
          .status(400)
          .json({ success: false, message: "No file uploaded" });
      }

      const imageUrl = req.file.path;
      const userId = req.user.id;

      const updatedUser = await userSchema
        .findByIdAndUpdate(userId, { images: imageUrl }, { new: true })
        .select("-password");

      if (!updatedUser) {
        return res
          .status(400)
          .json({ success: false, message: "User not found" });
      }

      res.status(200).json({
        success: true,
        message: "Profile picture uploaded successfully",
        data: updatedUser,
      });
    } catch (error) {
      res
        .status(500)
        .json({
          success: false,
          message: "Server error",
          error: error.message,
        });
    }
  });
};
//=====================================profiledetails======================================================
export const employeeProfileDetails = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await userSchema
      .findById(userId)
      .select("-password -otp -otpExpiry -resetToken -resetTokenExpiry");
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "user not found" });
    }
    return res.status(200).json({ success: true, data: user });
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        message: "Internal server error",
        error: error.message,
      });
  }
};
//=========================================jobAppliedCount======================================================
export const GetAppliedJobsCount = async (req, res) => {
  try {
    const userId = req.user.id;
    const appliedJobsCount = await jobApplication.countDocuments({
      employeeId: userId,
    });
    res.status(200).json({ success: true, data: { count: appliedJobsCount } });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};
//=========================================updateEmployeeProfile==================================================
// export const UpdateEmployeeProfile=async(req,res)=>{
//   try{
//     const userId=req.user.id;
//     const {name,email,googleId,phonenumber,linkedIn,github}=req.body;
//     const updatedData={};
//     if(name) updatedData.name=name  ;
//     if(email) updatedData.email=email  ;
//     if(phonenumber) updatedData.phonenumber=phonenumber  ;
//     if(googleId) updatedData.googleId=googleId  ;
//     if(linkedIn) updatedData.linkedIn=linkedIn  ;
//     if(github) updatedData.github=github  ;

//     if (Object.keys(updatedData).length === 0) {
//       return res.status(400).json({ success: false, message: "No updates provided" });
//     }

//     const updatedUser=await userSchema.findByIdAndUpdate(
//       userId,
//       updatedData,
//       {new:true,runValidators:true}
//     ).select("-password -otp -otpExpiry -resetToken -resetTokenExpiry");

//     if(!updatedUser){
//         return res.status(400).json({success:false,message:'user not found'})
//     }
//     res.status(200).json({
//       success:true,
//       message:"Profile updated successfully",
//       data:updatedUser
//     })
//   }catch(error){
//     return res
//     .status(500)
//     .json({success:false,message:"internal server error",error:error.message})
//   }
// }

export const UpdateEmployeeProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, email, phoneNumber, linkedIn, github } = req.body;
    const updatedData = {};
    if (name) updatedData.name = name;
    if (email) updatedData.email = email;
    if (phoneNumber) updatedData.phoneNumber = phoneNumber;
    if (linkedIn) updatedData.linkedIn = linkedIn;
    if (github) updatedData.github = github;
    if (Object.keys(updatedData).length === 0) {
      return errorHandler(res, 400, "No updates provided");
    }
    // Check for email uniqueness
    if (email) {
      const existingUser = await userSchema.findOne({
        email,
        _id: { $ne: userId },
      });
      if (existingUser) {
        return errorHandler(res, 400, "Email already in use");
      }
    }
    const updatedUser = await userSchema
      .findByIdAndUpdate(userId, updatedData, {
        new: true,
        runValidators: true,
      })
      .select("-password -otp -otpExpiry -resetToken -resetTokenExpiry");
    if (!updatedUser) {
      return errorHandler(res, 400, "User not found");
    }
    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    errorHandler(res, 500, "Internal server error", error.message);
  }
};
