// testMail.js
import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

transporter.sendMail(
  {
    from: `"Test" <${process.env.MAIL_USER}>`,
    to: "abidinesh2213@gmail.com",
    subject: "Test Email",
    text: "If you get this, email works.",
  },
  (err, info) => {
    if (err) return console.error("❌ Email Error:", err);
    console.log("✅ Email sent:", info.response);
  }
);
