const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    message: { type: String, required: true },
  },
  { timestamps: true }
);

// Optional: Add virtuals to format createdAt and updatedAt
contactSchema.virtual("createdAtFormatted").get(function () {
  return this.createdAt.toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    dateStyle: "full",
    timeStyle: "medium",
  });
});

contactSchema.virtual("updatedAtFormatted").get(function () {
  return this.updatedAt.toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    dateStyle: "full",
    timeStyle: "medium",
  });
});

contactSchema.set("toJSON", { virtuals: true });

module.exports = mongoose.model("Contact", contactSchema);
