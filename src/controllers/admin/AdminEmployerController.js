import employerSchema from "../../model/employer/employerSchema.js";

export const getAllEmployers=async(req ,res)=>{
  try {
    let { page = 1, limit = 10 } = req.query;
    page = parseInt(page, 10);
    limit = parseInt(limit, 10);

    const skip = (page - 1) * limit;
    const employers = await employerSchema.find().skip(skip).limit(limit);
    const totalEmployers = await employerSchema.countDocuments();
    if (!employers || employers.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "no users found" });
    }

    return res.status(200).json({
      success: true,
      message: "Employers fetched successfully",
      data: employers,
      pagination: {
        totalEmployers,
        currentPage: page,
        totalPages: Math.ceil(totalEmployers / limit),
        hasNextPage: skip + employers.length < totalEmployers,
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