const asyncHandler = require("express-async-handler");
const Contact = require("../models/contactmodel");
const { sendReplyEmail } = require("../utils/emailSender");

// @desc    Create a new contact entry
// @route   POST /api/contacts
exports.createContact = asyncHandler(async (req, res) => {
  const { name, email, contact, subject, message } = req.body;

  // Check for duplicate based on email and message
  const duplicate = await Contact.findOne({ email, message });
  if (duplicate) {
    return res.status(400).json({
      success: false,
      message: "Duplicate message already received from this email.",
    });
  }

  const newContact = await Contact.create({
    name,
    email,
    contact,
    subject,
    message,
  });

  const userMessage = `
    <p><strong>Subject:</strong> ${subject}</p>
    <p><strong>Your Message:</strong><br>${message}</p>
  `;

  await Promise.all([
    sendReplyEmail(
      "abishek.sathiyan.2002@gmail.com",
      `New Contact: ${subject}`,
      userMessage
    ),
    sendReplyEmail(email, "Thanks for contacting Abishek S", userMessage, name),
  ]);

  res.status(201).json({
    success: true,
    message: "Your message was received. A confirmation email has been sent.",
    contactId: newContact._id,
  });
});

// @desc    Get all contacts
// @route   GET /api/contacts
exports.getContacts = asyncHandler(async (_req, res) => {
  const contacts = await Contact.find().sort({ createdAt: -1 });
  res.status(200).json({ success: true, data: contacts });
});

// @desc    Mark a contact as read
// @route   PATCH /api/contacts/:id/read
exports.markAsRead = asyncHandler(async (req, res) => {
  const contact = await Contact.findByIdAndUpdate(
    req.params.id,
    { isRead: true },
    { new: true }
  );
  if (!contact) {
    return res
      .status(404)
      .json({ success: false, message: "Contact not found" });
  }
  res.status(200).json({ success: true, data: contact });
});

// @desc    Delete a contact
// @route   DELETE /api/contacts/:id
exports.deleteContact = asyncHandler(async (req, res) => {
  const contact = await Contact.findByIdAndDelete(req.params.id);
  if (!contact) {
    return res
      .status(404)
      .json({ success: false, message: "Contact not found" });
  }
  res.status(200).json({ success: true, message: "Deleted successfully" });
});
