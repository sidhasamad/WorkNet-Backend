import nodemailer from "nodemailer";
 export const sendEmail=async(to,subject,text)=>{
  try{
    const transporter=nodemailer.createTransport({
      service:"gmail",
      secure: true,
      auth:{
        user:process.env.EMAIL_USER,
        pass:process.env.EMAIL_PASS
      },
      debug: true, 
    logger: true,
    });
    await transporter.sendMail({
      from :'sidhaasamad@gmail.com',
      to,
      subject,
      text,
    })
   
    
  }catch (error){
  console.error("error sending email",error);
  throw new error('Failed to send email')
  }
}
