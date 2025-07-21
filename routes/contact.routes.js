const express = require("express");
const router = express.Router();
const Contact = require("../models/contact.model");

// POST /api/contacts - Save a contact
router.post("/", async (req, res) => {
  try {
    const { name, email, contact, subject, message } = req.body;

    // Validate required fields
    if (!name || !email || !message) {
      return res.status(400).json({ success: false, error: "All fields are required" });
    }

    // Check for duplicate (same name + email + message)
    const existing = await Contact.findOne({ name, email, message });
    if (existing) {
      return res.status(400).json({
        success: false,
        error: "❌ You have already submitted this message.",
      });
    }

    // Create new contact
    const newContact = new Contact({
      name,
      email,
      contact,
      subject,
      message,
    });

    await newContact.save();

    res.status(201).json({
      success: true,
      message: "✅ Message sent successfully!",
      data: newContact,
    });
  } catch (error) {
    console.error("Error submitting contact:", error.message);
    res.status(500).json({ success: false, error: "Server error. Please try again later." });
  }
});

module.exports = router;
