const asyncHandler = require("express-async-handler");
const Contact = require("../models/contact.model");
const { sendReplyEmail } = require("../utils/emailSender");

exports.createContact = asyncHandler(async (req, res) => {
  const { name, email, contact, subject, message } = req.body;

  const newContact = await Contact.create({ name, email, contact, subject, message });

  const userMessage = `
    <p><strong>Subject:</strong> ${subject}</p>
    <p><strong>Your Message:</strong><br>${message}</p>
  `;

  await Promise.all([
    sendReplyEmail("abishek.sathiyan.2002@gmail.com", `New Contact: ${subject}`, userMessage),
    sendReplyEmail(email, "Thanks for contacting Abishek S", userMessage, name),
  ]);

  res.status(201).json({
    success: true,
    message: "Your message was received. A confirmation email has been sent.",
    contactId: newContact._id,
  });
});

exports.getContacts = asyncHandler(async (_req, res) => {
  const contacts = await Contact.find().sort({ createdAt: -1 });
  res.status(200).json({ success: true, data: contacts });
});

exports.markAsRead = asyncHandler(async (req, res) => {
  const contact = await Contact.findByIdAndUpdate(req.params.id, { isRead: true }, { new: true });
  if (!contact) return res.status(404).json({ success: false, message: "Contact not found" });
  res.status(200).json({ success: true, data: contact });
});

exports.deleteContact = asyncHandler(async (req, res) => {
  const contact = await Contact.findByIdAndDelete(req.params.id);
  if (!contact) return res.status(404).json({ success: false, message: "Contact not found" });
  res.status(200).json({ success: true, message: "Deleted successfully" });
});
