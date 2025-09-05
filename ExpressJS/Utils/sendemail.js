const nodemailer = require("nodemailer");
/*const sendResetEmail = (email, link) => {
  console.log(`Send password reset email to ${email}: ${link}`);
};*/
// Create a test account or replace with real credentials.
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.BUSINESSEMAILID,
    pass: process.env.APPPASSWORD,
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