const asyncHandler = require("express-async-handler");
const Contact = require("../models/contact.model");
const { sendReplyEmail } = require("../utils/emailSender");

// @desc    Create a new contact entry
// @route   POST /api/contacts
exports.createContact = asyncHandler(async (req, res) => {
  const { name, email, contact, subject, message } = req.body;

  // Validation
  if (!name || !email || !message) {
    return res.status(400).json({
      success: false,
      message: "Name, email, and message are required.",
    });
  }

  // Check for duplicate
  const duplicate = await Contact.findOne({ email, message });
  if (duplicate) {
    return res.status(409).json({
      success: false,
      message: "Duplicate message already received from this email.",
    });
  }

  // Save to DB
  const newContact = await Contact.create({
    name,
    email,
    contact,
    subject,
    message,
  });

  // Email Content
  const userMessage = `
    <p><strong>Subject:</strong> ${subject}</p>
    <p><strong>Your Message:</strong><br>${message}</p>
  `;

  // Send notification + confirmation emails
  try {
    await Promise.all([
      sendReplyEmail(
        "abishek.sathiyan.2002@gmail.com",
        `New Contact from ${name}`,
        userMessage
      ),
      sendReplyEmail(email, "Thanks for contacting Abishek S", userMessage, name),
    ]);
  } catch (error) {
    console.error("Email sending failed:", error);
    return res.status(500).json({
      success: false,
      message: "Contact saved, but email sending failed.",
    });
  }

  res.status(201).json({
    success: true,
    message: "Your message has been received. A confirmation email was sent.",
    data: newContact,
  });
});

// @desc    Get all contacts
// @route   GET /api/contacts
exports.getContacts = asyncHandler(async (_req, res) => {
  const contacts = await Contact.find().sort({ createdAt: -1 });
  res.status(200).json({ success: true, count: contacts.length, data: contacts });
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
    return res.status(404).json({ success: false, message: "Contact not found." });
  }
  res.status(200).json({ success: true, message: "Marked as read", data: contact });
});

// @desc    Delete a contact
// @route   DELETE /api/contacts/:id
exports.deleteContact = asyncHandler(async (req, res) => {
  const contact = await Contact.findByIdAndDelete(req.params.id);
  if (!contact) {
    return res.status(404).json({ success: false, message: "Contact not found." });
  }
  res.status(200).json({ success: true, message: "Contact deleted successfully." });
});
