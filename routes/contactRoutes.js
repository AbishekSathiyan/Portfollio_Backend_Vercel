const express = require("express");
const router = express.Router();
const Contact = require("../models/contact.model");
const { sendReplyEmail } = require("../utils/emailSender");

router.post("/", async (req, res) => {
  try {
    const { name, email, contact, subject, message } = req.body;

    // 1. Save contact to MongoDB
    const newContact = new Contact({ name, email, contact, subject, message });
    const savedContact = await newContact.save();

    // 2. Email to admin (you)
    const adminMailHTML = `
      <h2>📩 New Contact Submission</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${contact || "Not provided"}</p>
      <p><strong>Subject:</strong> ${subject}</p>
      <p><strong>Message:</strong><br>${message}</p>
      <p><strong>Submitted at:</strong> ${new Date().toLocaleString()}</p>
    `;

    // 3. Email confirmation to user
    const userReplyHTML = `
      <p><strong>Subject:</strong> ${subject}</p>
      <p><strong>Your Message:</strong><br>${message}</p>
    `;

    // 4. Send emails (admin + user)
    await Promise.all([
      sendReplyEmail("abishek.sathiyan.2002@gmail.com", `New Contact: ${subject}`, adminMailHTML),
      sendReplyEmail(email, "Thanks for contacting Abishek S", userReplyHTML, name)
    ]);

    // 5. Response
    res.status(200).json({
      message: "Message saved and emails sent successfully.",
      id: savedContact._id
    });

  } catch (error) {
    console.error("❌ Contact save/send error:", error.message);
    res.status(500).json({ message: "Failed to send or store contact." });
  }
});

module.exports = router;
