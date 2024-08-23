import nodemailer from 'nodemailer';
const gmailPass = process.env['pass']
exports.mailSender = async(email,title,body)=>{
  try{
    //create transporter
     const transporter = nodemailer.createTransport({
       host:smpt.gmail.com,
       auth:{
         user:'monish.bellavi@gmail.com',
         pass:gmailPass,
       },
     });
    //send mail
    let info = await transporter.sendMail({
       from:"Finridhi",
       to:`${email}`,
       subject:`${title}`,
       html: `${body}`,
       })
      console.log(info);
      return info;
  }
  catch(error){
    console.log("error in sending mail",error.message);
  }
    
}

