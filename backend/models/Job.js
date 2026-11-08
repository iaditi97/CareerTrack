const mongoose = require('mongoose');

const JobSchema = new mongoose.Schema({
  title: { type: String, required: true, index: true },
  company: { type: String, required: true, index: true },
  location: { type: String, required: true, index: true },
  employmentType: { type: String, required: true, enum: ['Full-time', 'Part-time', 'Contract', 'Remote', 'Internship'] },
  experienceLevel: { type: String, required: true, enum: ['Entry Level', 'Mid Level', 'Senior Level'] },
  salaryRange: { type: String, required: true },
  description: { type: String, required: true },
  requirements: [{ type: String }],
  benefits: [{ type: String }],
  deadline: { type: Date, required: true },
  status: { type: String, enum: ['Active', 'Closed'], default: 'Active' },
  isPublished: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Job', JobSchema);
