const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const contactRoutes = require('../routes/contact.routes');
const app = express();

dotenv.config();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('API is running ✅');
});

app.use('/api/contact', contactRoutes);

module.exports = app; // ✅ VERY IMPORTANT FOR VERCEL
