import asyncHandler from "express-async-handler";
import Contact from "../models/contact.model.js";
import { sendReplyEmail } from "../utils/sendContactReply.js";

// @desc    Create a new contact entry
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
      message: "✅ Form Submitted Successfully!",
      data: newContact,
    });
  } catch (err) {
    console.error("❌ Email sending failed:", err.message);

    res.status(500).json({
      success: false,
      message:
        "📬 Thanks! We’ve saved your message. The confirmation email will be sent shortly once it goes through.",
      error: err.message,
      data: newContact,
    });
  }
});

// @desc    Get all contact messages
export const getContacts = asyncHandler(async (req, res) => {
  const contacts = await Contact.find().sort({ createdAt: -1 });
  res.status(200).json(contacts);
});

// @desc    Delete contact
export const deleteContact = asyncHandler(async (req, res) => {
  const contact = await Contact.findById(req.params.id);
  if (!contact) {
    res.status(404);
    throw new Error("Contact not found");
  }
  await contact.deleteOne();
  res.status(200).json({ message: "Contact deleted" });
});

// @desc    Mark contact as read/unread
export const markContactAsRead = asyncHandler(async (req, res) => {
  const contact = await Contact.findById(req.params.id);
  if (!contact) {
    res.status(404);
    throw new Error("Contact not found");
  }

  contact.isRead = req.body.read === true;
  await contact.save();

  res.status(200).json({
    message: "Marked as read",
    contact,
  });
});
