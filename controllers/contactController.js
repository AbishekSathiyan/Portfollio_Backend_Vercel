import asyncHandler from "express-async-handler";
import Contact from "../models/contact.model.js";
import { sendReplyEmail } from "../utils/sendContactReply.js";

// @route   POST /api/contacts
export const createContact = asyncHandler(async (req, res) => {
  const { name, email, contact, subject, message } = req.body;

  if (!name || !email || !message) {
    res.status(400);
    throw new Error("Please fill all required fields.");
  }

  const newContact = await Contact.create({
    name,
    email,
    contact,
    subject,
    message,
    isRead: false,
  });

  try {
    await sendReplyEmail(email, name, subject, message);

    res.status(201).json({
      success: true,
      message: "✅ Message sent successfully!",
      data: newContact,
    });
  } catch (err) {
    console.error("❌ Email sending failed:", err.message);

    res.status(500).json({
      success: false,
      message: "❌ Message saved but email failed to send.",
      error: err.message,
      data: newContact,
    });
  }
});
