import jwt from 'jsonwebtoken';
import userSchema from '../model/user/userSchema.js';
// import Employer from '../model/employer/EmployerSchema.js'; // or wherever your employer model is


export const verifyTokenEmployee = async (req, res, next) => {
  try {
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Access denied. No token provided." });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("id",decoded)
    const user = await userSchema.findById(decoded.userId);

    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }

    req.user = user; // attach employer to req.user
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid Token", error: err.message });
  }
};
