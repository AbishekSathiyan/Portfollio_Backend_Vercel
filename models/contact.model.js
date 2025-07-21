const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true, lowercase: true },
  contact: { type: String, default: "", trim: true },
  subject: { type: String, default: "", trim: true },
  message: { type: String, required: true, trim: true },
  isRead: { type: Boolean, default: false },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Optional: Prevent exact duplicate submissions with same email+message
contactSchema.index({ email: 1, message: 1 }, { unique: true, partialFilterExpression: { email: { $exists: true }, message: { $exists: true } } });

module.exports = mongoose.model("Contact", contactSchema);
