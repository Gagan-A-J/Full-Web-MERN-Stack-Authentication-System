const twilio = require('twilio');
const nodemailer = require("nodemailer");
/*const sendResetEmail = (email, link) => {
  console.log(`Send password reset email to ${email}: ${link}`);
};*/
// Create a test account or replace with real credentials.
const transporter = nodemailer.createTransport({
  service: "gmail", //We can use different email services
  auth: {
    user: process.env.BUSINESSEMAILID, //Add your business or Normal email ID here
    pass: process.env.APPPASSWORD, //Add your email app password here not published
  },
});

// Wrap in an async IIFE so we can use await.
async function sendResetEmail(to, subject, html) {
  const info = await transporter.sendMail({
    from: process.env.BUSINESSEMAILID,
    to,
    subject,
    html,
  });
}


const accountSid = process.env.AUTH_ACCOUNT_SID; //Add your Account SID from www.twilio.com/console
const authToken = process.env.AUTH_ACCOUNT_TOKEN; //Add your Auth Token from www.twilio.com/console
const twilioPhone = process.env.TWILIO_PHONE_NUMBER; //Add your Twilio Phone Number
const client = new twilio(accountSid, authToken);

exports.sendSMS = async (to, message) => {
  return await client.messages.create({
    body: message,
    from: twilioPhone,
    to,
  });
};


exports.module = sendResetEmail;