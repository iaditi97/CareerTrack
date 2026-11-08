const mongoose = require('mongoose');

const ApplicationSchema = new mongoose.Schema({
  jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  qualifications: { type: String, required: true },
  experience: { type: String, required: true },
  skills: [{ type: String }],
  coverLetter: { type: String },
  resumePath: { type: String, required: true },
  status: { type: String, enum: ['Submitted', 'Under Review', 'Shortlisted', 'Interview Scheduled', 'Selected', 'Rejected'], default: 'Submitted' },
  notes: { type: String, default: '' }
}, { timestamps: true });

ApplicationSchema.index({ jobId: 1, email: 1 }, { unique: true });

module.exports = mongoose.model('Application', ApplicationSchema);
