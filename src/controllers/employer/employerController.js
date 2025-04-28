import employerSchema from "../../model/employer/employerSchema.js";
import bcrypt from "bcrypt";
import { comparePassword } from "../../utilis/bcrypt.js";
import generateTokens from "../../utilis/jwt.js";

//========================================================================employerRegister====================================================
export const employerRegister = async (req, res) => {
  try {
    const { name, companyName, location, email, phone, password } = req.body;
    console.log("Request Body:", req.body); // Log request body
    console.log("Uploaded File:", req.file); // Log file details

    const existUser = await employerSchema.findOne({ email });
    if (existUser) {
      return res
        .status(400)
        .json({ success: false, message: "Email already exist" });
    }
    console.log("error occures", existUser);

    // const Logo=req.file["company logo"]?req.file["company logo"][0].path:null;
    const Logo = req.file ? req.file.path : null;
    const hashedPassword = await bcrypt.hash(password, 10);
    const newEmployer = new employerSchema({
      name,
      companyName,
      Logo,
      location,
      email,
      phone,
      password: hashedPassword,
    });
    await newEmployer.save();
    res
      .status(201)
      .json({ success: true, message: "Employer Registered successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
    console.error("Error while registering", error);
  }
};

//=================================================================================employerLogin============================================================
export const employerLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const existUser = await employerSchema.findOne({ email });
    if (!existUser) {
      return res
        .status(404)
        .json({ success: false, message: "User doesnt exist.Please register" });
    }
    const passwordValidation = await comparePassword(
      password,
      existUser.password
    );
    if (!passwordValidation) {
      return res
        .status(404)
        .json({ success: false, message: "Password doesnt match" });
    }
    const { accessToken, refreshToken } = generateTokens(existUser._id);
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: false,
      maxAge: 15 * 60 * 1000,
    });
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
      mexAge: 7 * 24 * 60 * 60 * 1000,
    });
    return res
      .status(200)
      .json({ 
        success: true, 
        message: "Employer login successfully" ,
        data:existUser,
        accessToken,
      });
  } catch (error) {
    console.error("Login failed",error.message);
    return res.status(500).json({success:false,message:'Internal server error'})
  }
};
