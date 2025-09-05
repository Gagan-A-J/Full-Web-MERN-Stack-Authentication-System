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
module.exports = { sendResetEmail };