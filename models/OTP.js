import mongoose from 'mongoose';
import {mailSender} from '../utils/mailSender';

const otpSchema = new mongoose.Schema({
  email:{
    type:String,
    required:true,
  },
  otp:{
    type:String,
    required:true,
  },
  createdAt:{
    type:Date,
    default:Date.now(),
    expires: 5*60,
  }
});

//function to send mails
async function sendVerificationEmail(email,otp){
  try{
    const mailResponse = await mailSender(email,"Verification Email from Finridhi",otp);
    console.log("Email sent Successfuly:",mailResponse);
  }
  catch(error){
     console.log("error occured while sending mails: ",error);
     throw error; 
  }
}
//pre middleware to send mail before making a db entry
otpSchema.pre("save",async function(next){
  await sendVerificationEmail(this.email,this.otp);
  next();
})

module.exports = mongoose.model("OTP",otpSchema);
