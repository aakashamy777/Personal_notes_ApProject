require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const noteRoutes = require('./routes/noteRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'public')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/notes', noteRoutes);

// Health check
app.get('/', (req, res) => {
  res.json({ message: 'Personal Notes API is running' });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Error handling middleware
app.use(errorHandler);

module.exports = app;
