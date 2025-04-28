import express from 'express'
import tryCatch from '../middleware/tryCatch.js'
import { handleTotalEmployees, handleTotalEmployers, handleTotalJobPosts } from '../controllers/admin/AdminDashboard.js'
import { employeeDelete, getAllEmployees, getEmployeeById } from '../controllers/admin/AdminEmployeeController.js'
import { getAllEmployers } from '../controllers/admin/AdminEmployerController.js'
const adminRouter=express.Router()

adminRouter.get('/totalemployees',tryCatch(handleTotalEmployees))
adminRouter.get('/totalemployers',tryCatch(handleTotalEmployers))
adminRouter.get('/totalJobPosts',tryCatch(handleTotalJobPosts))
adminRouter.get('/totalemployeeslist',tryCatch(getAllEmployees))
adminRouter.get('/getEmployeeId/:id',tryCatch(getEmployeeById))
adminRouter.delete('/employeeDelete/:id',tryCatch(employeeDelete))
adminRouter.get('/totalemployerslist',tryCatch(getAllEmployers))

export default adminRouter 