import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
import multer from "multer";
import {CloudinaryStorage} from 'multer-storage-cloudinary'

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
const storage=new CloudinaryStorage({
  cloudinary,
  params:{
    folder:'worknet_uploads',
    allowed_formats:["jpg","png","jpeg", "pdf"]
  },
})
const upload=multer({storage})

export {upload,cloudinary};
