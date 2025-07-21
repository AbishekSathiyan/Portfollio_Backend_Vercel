const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  contact: { type: String, default: "" },
  subject: { type: String, default: "" },
  message: { type: String, required: true },
  isRead: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

// 💡 Compound unique index (optional if you want DB-level prevention)
contactSchema.index({ email: 1, message: 1 }, { unique: true });

module.exports = mongoose.model("Contact", contactSchema);
