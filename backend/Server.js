require('dotenv').config();
const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const fs = require('fs');
const path = require('path');
const connectDB = require('./config/Db');
const errorHandler = require('./middleware/ErrorHandler');

const app = express();

if (!fs.existsSync('./uploads')) {
  fs.mkdirSync('./uploads');
}

connectDB();

app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173', credentials: true }));
app.use(express.json());

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { message: 'Too many requests from this client network environment.' }
});
app.use('/api/', apiLimiter);

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/auth', require('./routes/AuthRoutes'));
app.use('/api/jobs', require('./routes/JobRoutes'));
app.use('/api/applications', require('./routes/ApplicationRoutes'));

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 REST Core API listening on port ${PORT}`));
