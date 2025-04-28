import mongoose from "mongoose";
import userSchema from "../../model/user/userSchema.js";

export const getAllEmployees=async(req ,res)=>{
  try {
    let { page = 1, limit = userSchema } = req.query;
    page = parseInt(page, 10);
    limit = parseInt(limit, 10);

    const skip = (page - 1) * limit;
    const employees = await userSchema.find().skip(skip).limit(limit);
    const totalEmployees = await userSchema.countDocuments();
    if (!employees || employees.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "no users found" });
    }

    return res.status(200).json({
      success: true,
      message: "Users fetched successfully",
      data: employees,
      pagination: {
        totalEmployees,
        currentPage: page,
        totalPages: Math.ceil(totalEmployees / limit),
        hasNextPage: skip + employees.length < totalEmployees,
        hasPrevPage: page > 1,
      },
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: `Server error: ${error.message}` });
  }

}

//=============================================getEmployeesDetails============================


export const getEmployeeById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res
        .status(400)
        .json({ success: false, message: "User ID is required" });
    }

    const user = await userSchema.findById(id);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    return res.status(200).json({
      success: true,
      message: "User fetched successfully",
      data: user,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: `Server error: ${error.message}` });
  }
};
//======================================employeeDelete===================================
export const employeeDelete = async (req, res) => {
  const { id } = req.params;  
  console.log(id);

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ success: false, message: "User ID is invalid" });
  }

  const specificUser = await userSchema.findByIdAndDelete(id);
  
  if (!specificUser) {
    return res.status(404).json({ success: false, message: "User not found" });
  }

  // Return success message
  return res.status(200).json({
    success: true,
    message: "User deleted successfully",
    data: specificUser,
  });
};
//================================================employeeEdit========================================
