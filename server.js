import express from 'express';
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import cors from 'cors'
import cookieParser from 'cookie-parser';
import userRouter from './src/router/userRouter.js'
import employerRouter from './src/router/employerRouter.js';
import { errorHandler } from './src/middleware/errorHandling.js';
import adminRouter from './src/router/adminRouter.js';
import AuthRouter from './src/router/googleAuthRouter.js';


const app = express();
dotenv.config()
const PORT=process.env.PORT
const mongourl=process.env.MONGO_URL


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ 
  origin: "http://localhost:5173", 
  credentials: true 
}));
app.use(cookieParser())
app.use(errorHandler)

async function main() {
  try {
    mongoose.connect(mongourl);
    console.log("mongoDB connected successfully!");
    
  } catch (error) {
    console.error("Error:",error);
    
  }
}
main();
app.use('/api/user',userRouter)
app.use('/api/employer',employerRouter)
app.use('/api/admin',adminRouter)
app.use('/api',AuthRouter)

app.listen(PORT,()=>{
  console.log(`Server conntected to the ${PORT}`);
  
})
