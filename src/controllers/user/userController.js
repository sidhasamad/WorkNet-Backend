import userSchema from "../../model/user/userSchema.js";
import { comparePassword, hashPassword } from "../../utilis/bcrypt.js";
import generateTokens from "../../utilis/jwt.js";
import bcrypt from "bcrypt";
import { sendEmail } from "../../utilis/sendEmail.js";
import { OAuth2Client } from "google-auth-library";
import dotenv from "dotenv"
dotenv.config()
//===========================================Registration======================================================
// const client=new OAuth2Client(process.env.GOOGLE_CLIENT_ID)
export const userRegister = async (req, res) => {
  try {
    const { name, email, password, role ,phonenumber} = req.body;
    const existUser = await userSchema.findOne({ email });
    if (!phonenumber) {
      return res.status(400).json({ success: false, message: "Phone number is required" });
    }


    if (existUser) {
      return res
        .status(400)
        .json({ success: false, message: "Email already exist" });
    }
    const hashedPassword = await hashPassword(password);
    const newUser = new userSchema({
      name,
      email,
      password: hashedPassword,
      phonenumber:phonenumber,
      role: role || "user",
    });
    await newUser.save();
    console.log(newUser)
    return res.status(201).json({
      success: true,
      message: "registered successfully",
      data: newUser,
    });
  } catch (error) {
    console.error("Registration failed", error.message);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

//==========================================================================userlogin=====================================================================

export const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(email,password)
    const existUser = await userSchema.findOne({ email });

    if (!existUser) {
      return res.status(404).json({
        success: false,
        message: "User doesn't exist. Please register",
      });
    }

    const passwordValidation = await comparePassword(
      password,
      existUser.password
    );
    if (!passwordValidation) {
      return res.status(404).json({
        success: false,
        message: "Password doesn't match",
      });
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
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    const isAdmin = existUser.role === "admin";

    return res.status(200).json({
      success: true,
      message:isAdmin?"Admin login successfully!": "Login successfully",
      data: existUser,
      accessToken,
      isAdmin
    });
  } catch (error) {
    console.error("Login failed", error.message);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

//==========================================================================forget password========================================================

export const ForgotPassword=async(req,res)=>{
  try{
    const {email}=req.body;
    console.log("📩 Received forgot password request for:", email);
    const user=await userSchema.findOne({email});
    console.log("🧑‍💻 Found user:", user);
    
    if(!user){
      return res 
      .status(404)
      .json({success:false,message:'User not found'})
    }
    const otp=Math.floor(100000+Math.random()*900000)
    console.log("🔢 Generated OTP:", otp);
    user.otp=otp;
    user.otpExpiry=new Date(Date.now()+15*60*1000);
    user.markModified("otp");
    user.markModified("otpExpiry");

    console.log("📩 Saving OTP:", user.otp, " Expiry:", user.otpExpiry);
    await user.save();
    await sendEmail(
      user.email,
      "Password reset OTP",
      `Your otp for password reset is: ${otp}(Valid for 15 minutes)`
    );
    res.status(200).json({success:true,message:'OTP send to email'})
  }catch(error){
     console.error('Error in forgot password',error.message);
     res.status(500).json({success:false,message:'Internal server error'})
  }
}

//===============================================verifyotp===========================================

export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await userSchema.findOne({ email:email.toLowerCase() });

    if (!user || user.otp !== Number(otp) || user.otpExpiry < Date.now()) {
      return res.status(404).json({ success: false, message: "Invalid email or OTP" });
    }

    return res.status(200).json({ success: true, message: "OTP verified", email });
  } catch (error) {
    console.error("Error verifying OTP", error.message);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

//=========================================resetpassword========================================
export const resetPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;
    const user = await userSchema.findOne({ email });

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.otp = undefined;
    user.otpExpiry = undefined;
    user.markModified("otp");
    user.markModified("otpExpiry");
    await user.save();

    return res.status(200).json({ success: true, message: "Password reset successfully" });
  } catch (error) {
    console.error("Error resetting password", error.message);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};
//==============================================================Google auth===========================================================================


export const googleAuth = async (req, res) => {
  try {
    const { email, name } = req.googleUser;

    let user = await userSchema.findOne({ email });

    if (!user) {
      user = new userSchema({
        googleId: email,
        name,
      });

      await user.save();
    }

    // Generate JWT token
    const authToken = generateTokens(user._id, { expiresIn: "7d" });

    // Set cookie with the token
    res.cookie("accessToken", authToken, {
      httpOnly: true,
      secure: false, 
    });

    // Return response
    return res.status(200).json({
      message: "Google Login Successful",
      accessToken: authToken,
      user: { id: user._id, email: user.email, name: user.name },
    });
  } catch (error) {
    console.error("Error during Google login", error.message);
    return res.status(500).json({ error: "Internal server error" });
  }
};


