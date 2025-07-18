const mongoose = require('mongoose');
const Contact = require('../models/contact.model');
const { sendReplyEmail } = require('../utils/emailSender');

let isConnected = false;

module.exports = async (req, res) => {
  if (!isConnected) {
    await mongoose.connect(process.env.MONGO_URI);
    isConnected = true;
  }

  if (req.method === 'POST') {
    try {
      const { name, email, contact, subject, message } = req.body;
      const newContact = new Contact({ name, email, contact, subject, message });
      await newContact.save();
      await sendReplyEmail(email, name); // optional reply
      res.status(200).json({ success: true, message: "Message sent!" });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
};
