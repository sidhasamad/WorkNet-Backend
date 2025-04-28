import bcrypt from 'bcrypt';
export const hashPassword=async(password)=>{
  return await bcrypt.hash(password,10)
}
export const comparePassword=async(password,newPassword)=>{
  console.log("password",password);
  console.log("newsidha",newPassword);
  
  return await bcrypt.compare(password,newPassword)
}