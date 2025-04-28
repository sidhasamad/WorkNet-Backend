import express from 'express'
const employerRouter=express.Router()
import tryCatch from '../middleware/tryCatch.js';
import { employerLogin, employerRegister } from '../controllers/employer/employerController.js';
import {upload} from '../../config/cloudinary.js'
import { getJobId, getJobPost, JobDelete, JobEdit, jobPost } from '../controllers/employer/JobPostCOntroller.js';
import { tokenVerificationEmployer } from '../middleware/tokenVerificationEmployer.js';
import { getApplicationEmployer } from '../controllers/employer/ApplicantsController.js';

// employerRouter.post("/employerRegister", upload.single("companyLogo"), tryCatch(employerRegister));
employerRouter.post("/employerRegister", upload.single("Logo"), tryCatch(employerRegister));
employerRouter.post('/employerLogin',tryCatch(employerLogin))
employerRouter.post('/jobPost/jobPost',tokenVerificationEmployer, tryCatch(jobPost))
employerRouter.get('/jobPost/getJobPost',tryCatch(getJobPost))
employerRouter.get('/jobPost/getJobId/:id',tryCatch(getJobId))
employerRouter.put('/jobPost/editJobPost/:id',tryCatch(JobEdit))
employerRouter.delete('/jobPost/deleteJobPost/:id',tryCatch(JobDelete))
employerRouter.get('/applicants/getApplicants/:jobId',tryCatch(getApplicationEmployer))
export default employerRouter 