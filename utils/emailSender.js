const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE || 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/**
 * Sends a styled HTML email to a user
 * @param {string} to - Recipient email address
 * @param {string} subject - Email subject
 * @param {string} userMessage - Custom HTML content (message from form)
 * @param {string} name - Recipient name (optional for greeting)
 */
const sendReplyEmail = async (to, subject, userMessage, name = 'there') => {
  try {
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; background: #f9f9f9; border-radius: 8px;">
        <h2 style="color: #2c3e50;">Hi ${name},</h2>
        <p style="font-size: 16px; color: #333;">
          Thank you for getting in touch! I’ve received your message and will respond as soon as possible.
        </p>

        <div style="margin: 20px 0; padding: 15px; background-color: #ffffff; border-left: 5px solid #3498db;">
          ${userMessage}
        </div>

        <p style="font-size: 16px; color: #333;">
          In the meantime, feel free to explore my work or connect with me on LinkedIn.
        </p>

        <p style="margin-top: 30px; font-size: 14px; color: #888;">
          — Abishek S<br>
          MERN Stack Developer<br>
          <a href="mailto:abishek.sathiyan.2002@gmail.com" style="color: #3498db;">abishek.sathiyan.2002@gmail.com</a>
        </p>

        <hr style="margin-top: 40px;">
        <p style="font-size: 12px; color: #aaa;">
          This is an automated message. If you didn’t send this, please ignore.
        </p>
      </div>
    `;

    const mailOptions = {
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to,
      subject,
      html,
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ Email sent to: ${to}`);
  } catch (error) {
    console.error('❌ Error sending email:', error.message);
    throw error;
  }
};

module.exports = { sendReplyEmail };
