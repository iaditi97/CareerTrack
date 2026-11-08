const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

// ➕ ADDED: Secure Administrator Account Registration Endpoint
router.post('/register', async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Guard: Prevent duplicate accounts with the same email string identifier
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ message: 'This email is already registered.' });
    }

    // Instantiates and auto-hashes the entry inside your cloud cluster collection matrix
    const admin = await Admin.create({ email, password });
    
    // Auto-login the user by signing and handing back a valid 24-hour access signature token
    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET || 'super_secret_key', { expiresIn: '24h' });
    
    res.status(201).json({ token, email: admin.email });
  } catch (err) { next(err); }
});

// 🔑 Your Existing System Login Verification Logic Block
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email });
    if (!admin || !(await admin.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }
    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET || 'super_secret_key', { expiresIn: '24h' });
    res.json({ token, email: admin.email });
  } catch (err) { next(err); }
});

module.exports = router;
