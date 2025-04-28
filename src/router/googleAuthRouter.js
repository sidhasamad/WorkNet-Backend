import express from "express";
import { googleAuth } from "../controllers/user/userController.js";
import { googleAuthMiddleware } from "../middleware/AuthMiddleware.js";
const AuthRouter=express.Router()
AuthRouter.post('/auth/google',googleAuthMiddleware,googleAuth)
export default AuthRouter