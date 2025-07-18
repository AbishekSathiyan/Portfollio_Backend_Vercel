const asyncHandler = require("express-async-handler");
const Contact = require("../models/Contact");
const { sendReplyEmail } = require("../../utils/emailSender");

/* ------------------------------------------------------------------ */
/*  POST /api/contacts  |  Public  |  Create a new contact + auto‑reply */
exports.createContact = asyncHandler(async (req, res) => {
  const { name, email, contact, subject, message } = req.body;

  // 1️⃣  Save to DB (all fields)
  const savedContact = await Contact.create({
    name,
    email,
    contact,
    subject,
    message,
  });

  // 2️⃣  Build plain HTML auto‑reply
  const htmlContent = `
    <p style="font-size:16px;margin-top:20px;">Dear ${name},</p>
    <p style="font-size:15px;">
      Thank you for contacting me! I've received your message and will get back to you soon.
    </p>
    <p style="font-size:15px;">
      Best regards,<br/>
      <strong>Abishek S</strong>
    </p>
  `;

  // 3️⃣  Fire‑and‑forget auto‑reply
  sendReplyEmail(
    email,
    `Re: ${subject || "Your Inquiry"}`,
    htmlContent
  ).catch((err) => console.error("❌ Auto‑reply failed:", err));

  // 4️⃣  Respond
  res.status(201).json({
    success: true,
    data: savedContact,
    message: "Thank you for your message! I will get back to you soon.",
  });
});

/* ------------------------------------------------------------------ */
/*  GET /api/contacts  |  Private |  List all contacts */
exports.getContacts = asyncHandler(async (_req, res) => {
  const contacts = await Contact.find().sort({ createdAt: -1 });
  res.status(200).json({
    success: true,
    count: contacts.length,
    data: contacts,
  });
});

/* ------------------------------------------------------------------ */
/*  PATCH /api/contacts/:id/read  |  Private |  Mark as read */
exports.markAsRead = asyncHandler(async (req, res) => {
  const contact = await Contact.findByIdAndUpdate(
    req.params.id,
    { isRead: true },
    { new: true, runValidators: true }
  );

  if (!contact) {
    return res.status(404).json({
      success: false,
      message: "Contact not found",
    });
  }

  res.status(200).json({ success: true, data: contact });
});

/* ------------------------------------------------------------------ */
/*  DELETE /api/contacts/:id  |  Private |  Remove a contact */
exports.deleteContact = asyncHandler(async (req, res) => {
  const contact = await Contact.findByIdAndDelete(req.params.id);

  if (!contact) {
    return res.status(404).json({
      success: false,
      message: "Contact not found",
    });
  }

  res.status(200).json({
    success: true,
    data: {},
    message: "Contact deleted successfully",
  });
});
