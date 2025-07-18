const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE || 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendReplyEmail = async (to, subject, userMessage, name = 'there') => {
  const html = `
    <div style="font-family:sans-serif;padding:20px;">
      <h2>Hi ${name},</h2>
      <p>Thanks for reaching out! I've received your message.</p>
      <div style="margin:20px 0;padding:10px;border-left:4px solid #3498db;">${userMessage}</div>
      <p>— Abishek S</p>
    </div>
  `;

  await transporter.sendMail({ from: process.env.EMAIL_FROM || process.env.EMAIL_USER, to, subject, html });
};

module.exports = { sendReplyEmail };
