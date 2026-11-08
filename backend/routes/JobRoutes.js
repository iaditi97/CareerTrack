const express = require('express');
const router = express.Router();
const { getPublicJobs, getJobById, createJob, updateJob, deleteJob } = require('../controllers/JobController');
const { protect } = require('../middleware/Auth');

router.get('/', getPublicJobs);
router.get('/:id', getJobById);
router.post('/', protect, createJob);
router.put('/:id', protect, updateJob);
router.delete('/:id', protect, deleteJob);

module.exports = router;
