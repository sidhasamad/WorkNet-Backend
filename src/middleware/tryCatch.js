 const tryCatch = (controller) => async (req, res, next) => {
  try {
    await controller(req, res, next);
  } catch (error) {
    console.log("trycatch error", error.message);
    res.status(500).json({success:false,message:'Internal server error'})
  }
};
export default tryCatch
