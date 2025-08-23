import express from "express";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config(); // ✅ Load .env variables

const router = express.Router();
let otpStore = {}; // In-memory store (consider Redis for production)

// Generate 6-digit OTP
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
    pass: process.env.MAIL_PASS, // Gmail App Password
  },
  tls: { rejectUnauthorized: false },
});

// ================= Send OTP =================
router.post("/send-otp", async (_req, res) => {
  try {
    const email = process.env.ADMIN_EMAIL || process.env.MAIL_USER;
    const otp = generateOtp();
    otpStore[email] = otp;

    console.log(`📩 OTP for ${email}: ${otp}`);

    await transporter.sendMail({
      from: `"Admin Auth" <${process.env.MAIL_USER}>`,
      to: email,
      subject: "🔐 Your Admin OTP",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px; background-color: #f9f9f9;">
          <h2 style="color: #333; text-align: center;">Admin OTP Verification</h2>
          <p style="font-size: 16px; color: #555;">Your One-Time Password (OTP) is:</p>
          <div style="text-align: center; margin: 20px 0;">
            <span style="font-size: 36px; font-weight: bold; color: #0b74de;">${otp}</span>
          </div>
          <p style="font-size: 14px; color: #888;">
            This OTP is valid for a single use. Please do not share it with anyone.
          </p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
          <p style="font-size: 12px; color: #aaa; text-align: center;">
            If you did not request this OTP, please ignore this email.
          </p>
        </div>
      `,
    });

    res.json({ success: true, message: "OTP sent to admin email" });
  } catch (error) {
    console.error("❌ Error sending OTP:", error);
    res.status(500).json({ success: false, message: "Error sending OTP" });
  }
});

// ================= Verify OTP =================
router.post("/verify-otp", async (req, res) => {
  try {
    const { otp } = req.body;
    const email = process.env.ADMIN_EMAIL || process.env.MAIL_USER;
    const storedOtp = otpStore[email];

    if (storedOtp && otp === storedOtp) {
      delete otpStore[email]; // Remove OTP after verification
      return res.json({ success: true, message: "OTP verified successfully" });
    }

    res.json({ success: false, message: "Invalid OTP" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error verifying OTP" });
  }
});

export default router;
