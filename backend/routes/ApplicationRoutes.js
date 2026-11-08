const express = require('express');
const router = express.Router();
const { submitApplication, getJobApplications, updateStatus, exportToCSV } = require('../controllers/ApplicationController');
const { protect } = require('../middleware/Auth');
const upload = require('../middleware/Upload');

router.post('/submit', upload.single('resume'), submitApplication);
router.get('/job/:jobId', protect, getJobApplications);
router.put('/:id/status', protect, updateStatus);
router.get('/job/:jobId/export', protect, exportToCSV);

module.exports = router;
