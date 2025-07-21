const express = require("express");
const router = express.Router();
const Contact = require("../models/contact.model");

// 📥 POST /api/contacts - Save a contact
// POST /api/contacts
router.post("/", async (req, res) => {
  try {
    const { name, email, contact, subject, message } = req.body;

    if (!name || !email || !contact || !subject || !message) {
      return res.status(400).json({ error: "All fields are required" });
    }

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
      message: "✅ Contact saved successfully",
      data: newContact,
    });
  } catch (error) {
    console.error("❌ Error saving contact:", error);
    res.status(500).json({ error: "Server error" });
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
