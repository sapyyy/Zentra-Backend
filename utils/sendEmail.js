const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
  // 1. Create a transporter
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.EMAIL_USERNAME, // Your gmail address
      pass: process.env.EMAIL_PASSWORD, // Your generated App Password
    },
  });

  // 2. Define the email options
  const mailOptions = {
    from: "Zentra Tourism <noreply@zentra.com>",
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  // 3. Actually send the email
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
