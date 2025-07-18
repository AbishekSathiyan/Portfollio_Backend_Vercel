require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const nodemailer = require("nodemailer");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Mongoose schema
const contactSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  contact: { type: String },
  subject: { type: String, required: true },
  message: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const Contact = mongoose.models.Contact || mongoose.model("Contact", contactSchema);

// Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// POST: Submit contact
app.post("/api/contacts", async (req, res) => {
  try {
    const { name, email, contact, subject, message } = req.body;

    const newContact = new Contact({ name, email, contact, subject, message });
    const savedContact = await newContact.save();

    const adminMailOptions = {
      from: process.env.EMAIL_USER,
      to: "abishek.sathiyan.2002@gmail.com",
      subject: `New Contact Form Submission: ${subject}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Contact:</strong> ${contact}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Message:</strong> ${message}</p>
        <p><strong>Submission ID:</strong> ${savedContact._id}</p>
      `,
    };

    const userMailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Thanks for contacting me!",
      html: `
        <h2>Hi ${name},</h2>
        <p>Thank you for reaching out! I've received your message and will respond soon.</p>
        <h3>Your Message:</h3>
        <p><strong>Subject:</strong> ${subject}</p>
        <p>${message}</p>
        <br>
        <p>— Abishek S<br>MERN Stack Developer</p>
        <hr>
        <small>This is an automated reply.</small>
      `,
    };

    await Promise.all([
      transporter.sendMail(adminMailOptions),
      transporter.sendMail(userMailOptions),
    ]);

    res.status(200).json({
      message: "Your message was received. A confirmation email has been sent.",
      contactId: savedContact._id,
    });
  } catch (error) {
    console.error("❌ Error handling contact:", error);
    res.status(500).json({ message: "Failed to submit contact form." });
  }
});

// GET: All contacts
app.get("/api/contacts", async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.json(contacts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Health check
app.get("/", (req, res) => {
  res.send("Backend running ✅");
});

// ✅ Export the app for Vercel
module.exports = app;
