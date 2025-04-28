import jwt from 'jsonwebtoken';
// import Employer from '../model/employer/EmployerSchema.js'; // or wherever your employer model is
import employerSchema from '../model/employer/employerSchema.js';


export const tokenVerificationEmployer = async (req, res, next) => {
  try {
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Access denied. No token provided." });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("id",decoded)
    const employer = await employerSchema.findById(decoded.userId);

    if (!employer) {
      return res.status(404).json({ message: "Employer not found" });
    }

    req.user = employer; // attach employer to req.user
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid Token", error: err.message });
  }
};
