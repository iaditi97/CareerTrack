const Application = require('../models/Application');
const Job = require('../models/Job');

exports.submitApplication = async (req, res, next) => {
  try {
    const { jobId } = req.body;
    const job = await Job.findById(jobId);
    if (!job || !job.isPublished || job.status !== 'Active' || new Date() > new Date(job.deadline)) {
      return res.status(400).json({ message: 'Application failed. Job is closed or expired.' });
    }
    if (!req.file) return res.status(400).json({ message: 'Resume file missing.' });
    res.status(201).json(await Application.create({ ...req.body, resumePath: req.file.path }));
  } catch (err) { next(err); }
};

exports.getJobApplications = async (req, res, next) => {
  try {
    const records = await Application.find({ jobId: req.params.jobId }).sort({ createdAt: -1 });
    res.json({ count: records.length, records });
  } catch (err) { next(err); }
};

exports.updateStatus = async (req, res, next) => {
  try { res.json(await Application.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true })); } catch (err) { next(err); }
};

exports.exportToCSV = async (req, res, next) => {
  try {
    const apps = await Application.find({ jobId: req.params.jobId });
    let csv = 'Name,Email,Phone,Status\n';
    apps.forEach(a => csv += `"${a.name}","${a.email}","${a.phone}","${a.status}"\n`);
    res.header('Content-Type', 'text/csv').attachment('applications.csv').send(csv);
  } catch (err) { next(err); }
};

