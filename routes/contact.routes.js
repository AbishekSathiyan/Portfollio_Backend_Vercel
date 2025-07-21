const express = require("express");
const router = express.Router();
const Contact = require("../models/contact.model");

// 📥 POST /api/contacts - Save a contact
router.post("/", async (req, res) => {
  console.log("📥 Received contact form data:", req.body);

  try {
    const { name, email, contact, subject, message } = req.body;

    // 🔒 Basic validation
    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        error: "Name, Email, and Message are required fields",
      });
    }

    // 💾 Save to MongoDB
    const newContact = new Contact({
      name,
      email,
      contact: contact || null,   // Optional
      subject: subject || null,   // Optional
      message,
    });

    const savedContact = await newContact.save();

    return res.status(201).json({
      success: true,
      message: "✅ Contact submitted successfully",
      data: savedContact,
    });
  } catch (error) {
    console.error("❌ Error saving contact:", error);

    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        error: `Validation Error: ${error.message}`,
      });
    }

    return res.status(500).json({
      success: false,
      error: `Internal Server Error: ${error.message}`,
    });
  }
});

// ✅ GET /api/contacts - Return all contacts
router.get("/", async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: "✅ Contacts fetched successfully",
      count: contacts.length,
      data: contacts,
    });
  } catch (error) {
    console.error("❌ Error fetching contacts:", error);

    return res.status(500).json({
      success: false,
      error: `Failed to fetch contacts: ${error.message}`,
    });
  }
});

module.exports = router;
