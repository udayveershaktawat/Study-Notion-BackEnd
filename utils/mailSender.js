const nodemailer = require("nodemailer");

const mailSender = async (email, title, body) => {
  try {
    let transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    let info = await transporter.sendMail({
      from: `study-notion || Udayveer singh shaktawat`,
      to: `${email}`,
      subject: `${title}`,
      html: `${body}`,
    });
    console.log(info);
    return info;
  } catch (error) {
    console.log(error.message);
  }
};

// a function to send emails

async function sendVerificationEmail(email, otp){
    try{

    }
    catch(error){
        console.log("error occer while sending email",error)
        throw error
    }
}










module.exports = mailSender;
