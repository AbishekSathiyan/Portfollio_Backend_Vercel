// api/routes/adminAuth.js
import express from "express";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const router = express.Router();
let otpStore = {};

// Generate OTP
function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Mail setup
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

// ✅ Send OTP
router.post("/send-otp", async (req, res) => {
  try {
    const email = process.env.MAIL_USER;
    const otp = generateOtp();
    otpStore[email] = otp;

    console.log(`📩 OTP for ${email}: ${otp}`);

    await transporter.sendMail({
      from: `"Admin Auth" <${process.env.MAIL_USER}>`,
      to: email,
      subject: "🔐 Your Admin OTP",
      html: `
        <div style="font-family: Arial, sans-serif;">
          <h2>Admin OTP Verification</h2>
          <p>Your OTP is:</p>
          <h1>${otp}</h1>
          <p>This OTP is valid for single use only.</p>
        </div>
      `,
    });

    res.json({ success: true, message: "OTP sent successfully" });
  } catch (error) {
    console.error("❌ Error sending OTP:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// ✅ Verify OTP
router.post("/verify-otp", (req, res) => {
  const { otp } = req.body;
  const email = process.env.MAIL_USER;

  if (otpStore[email] && otpStore[email] === otp) {
    delete otpStore[email];
    return res.json({ success: true, message: "OTP verified successfully" });
  }

  return res.json({ success: false, message: "Invalid OTP" });
});

export default router;
