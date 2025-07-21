const express = require("express");
const router = express.Router();
const Contact = require("../models/contact.model");

// 📥 POST /api/contacts - Save a contact
router.post("/", async (req, res) => {
  try {
    const { name, email, contact, subject, message } = req.body;

    // 🔍 Validation check
    if (!name || !email || !contact || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: "❌ All fields are required.",
      });
    }

    // 🔁 Duplicate check (based on email and message)
    const isDuplicate = await Contact.findOne({ email, message });
    if (isDuplicate) {
      return res.status(409).json({
        success: false,
        message: "⚠️ Duplicate message already received from this email.",
      });
    }

    // ✅ Save new contact
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
    console.error("❌ Error saving contact:", error);

    // MongoDB duplicate key error
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "⚠️ Duplicate entry detected. Please check your message.",
      });
    }

    res.status(500).json({
      success: false,
      message: "❌ Server error. Please try again later.",
    });
  }
});

// ✅ GET /api/contacts - Fetch all
router.get("/", async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: "✅ Contacts fetched successfully",
      count: contacts.length,
      data: contacts,
    });
  } catch (error) {
    console.error("❌ Error fetching contacts:", error);
    res.status(500).json({
      success: false,
      message: `❌ Failed to fetch contacts: ${error.message}`,
    });
  }
});

module.exports = router;
