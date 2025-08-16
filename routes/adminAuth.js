import express from "express";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config(); // ✅ Load .env variables


const router = express.Router();
let otpStore = {};

// Generate OTP
function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Configure Nodemailer for Gmail
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS, // App Password
  },
  tls: { rejectUnauthorized: false },
});

// Send OTP
router.post("/send-otp", async (_req, res) => {
  try {
    const email = process.env.ADMIN_EMAIL || process.env.MAIL_USER;
    const otp = generateOtp();
    otpStore[email] = otp;

    console.log(`📩 OTP for ${email}: ${otp}`);

    await transporter.sendMail({
      from: `"Admin Auth" <${process.env.MAIL_USER}>`,
      to: email,
      subject: "Your Admin OTP",
      text: `Your OTP is: ${otp}`,
    });

    res.json({ success: true, message: "OTP sent to admin email" });
  } catch (error) {
    console.error("❌ Error sending OTP:", error);
    res.status(500).json({ success: false, message: "Error sending OTP" });
  }
});

// Verify OTP
router.post("/verify-otp", async (req, res) => {
  try {
    const { otp } = req.body;
    const email = process.env.ADMIN_EMAIL || process.env.MAIL_USER;
    const storedOtp = otpStore[email];

    if (storedOtp && otp === storedOtp) {
      delete otpStore[email];
      return res.json({ success: true, message: "OTP verified successfully" });
    }

    res.json({ success: false, message: "Invalid OTP" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error verifying OTP" });
  }
});

export default router;
