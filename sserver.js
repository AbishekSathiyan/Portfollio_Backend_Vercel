require('dotenv').config();
const express = require('express');
const cors = require('cors');
const contactRoutes = require('./routes/contact.routes');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// DB Connection
connectDB();

// Routes
app.use('/api/contacts', contactRoutes);

// Health check
app.get('/', (req, res) => res.send('✅ API is running'));

// Error handler
app.use(errorHandler);

module.exports = app;
