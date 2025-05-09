import express from 'express'
import tryCatch from '../middleware/tryCatch.js'
import { ForgotPassword, resetPassword, userLogin, userRegister, verifyOtp } from '../controllers/user/userController.js'
import { getUserJob, getUserJobId } from '../controllers/user/userJobsController.js'
import { getuserSave, savedDelete, userSave } from '../controllers/user/userSavedController.js'
import { verifyTokenEmployee } from '../middleware/tokenVerificationEmployee.js'
import { EmployeeProfile, employeeProfileDetails, GetAppliedJobsCount, UpdateEmployeeProfile, UploadProfilePicture,} from '../controllers/user/userProfileController.js'
import { ApplyJob, getAppliedJobs, getNotifications, handleEmployeeStatus } from '../controllers/user/userApplyJobController.js'
import { upload } from '../../config/cloudinary.js'
import { getMarkOneAsRead, getUnreadCount, newNotification, notificationLength } from '../controllers/employer/ApplicantsController.js'
// import { upload } from '../../config/cloudinary.js'

const userRouter=express.Router()
userRouter.post('/register',tryCatch(userRegister))
userRouter.post('/userlogin',tryCatch(userLogin))
userRouter.post('/userforgotPassword',tryCatch(ForgotPassword))
// userRouter.post('/resetPassword',tryCatch(verifyOtpAndResetPassword))
userRouter.post('/verifyOtp',tryCatch(verifyOtp))
userRouter.post('/resetPassword',tryCatch(resetPassword))
userRouter.get('/jobs/getUser-job',tryCatch(getUserJob))
userRouter.get('/jobs/getUser-jobDetails/:id',tryCatch(getUserJobId))
userRouter.post('/jobs/userSaved/:id',verifyTokenEmployee,tryCatch(userSave))
userRouter.get('/jobs/getuserSaved',verifyTokenEmployee,tryCatch(getuserSave))
userRouter.delete('/jobs/savedDelete/:id',verifyTokenEmployee,tryCatch(savedDelete))
//==============================profile========================
userRouter.get('/employeeProfile',verifyTokenEmployee,tryCatch(EmployeeProfile))
userRouter.post('/uploadProfile',verifyTokenEmployee,tryCatch(UploadProfilePicture))
userRouter.get('/employeeProfileDetails',verifyTokenEmployee,tryCatch(employeeProfileDetails))
userRouter.get('/getappliedJobsCount',verifyTokenEmployee,tryCatch(GetAppliedJobsCount))
userRouter.put('/updateEmployeeProfile',verifyTokenEmployee,tryCatch(UpdateEmployeeProfile))
//====================================
userRouter.post('/jobs/applyJob',verifyTokenEmployee,upload.single('resume'),tryCatch(ApplyJob))
userRouter.get('/jobs/getappliedJob',verifyTokenEmployee,tryCatch(getAppliedJobs))
//================================notification======================
userRouter.get('/notifications',verifyTokenEmployee,tryCatch(handleEmployeeStatus))
userRouter.get('/getnotifications',verifyTokenEmployee,tryCatch(getNotifications))
userRouter.get('/:userId',verifyTokenEmployee,tryCatch(notificationLength))
userRouter.get('/unread/count/:userId',verifyTokenEmployee,tryCatch(getUnreadCount))
userRouter.put('/mark-read/:id',verifyTokenEmployee,tryCatch(getMarkOneAsRead))
userRouter.post('/newNotification',verifyTokenEmployee,tryCatch(newNotification))
export default userRouter
