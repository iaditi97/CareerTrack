const Job = require('../models/Job');

exports.getPublicJobs = async (req, res, next) => {
  try {
    const { search, company, location, type, experience, page = 1, limit = 10 } = req.query;
    let cond = { isPublished: true, status: 'Active' };
    if (search) cond.title = { $regex: search, $options: 'i' };
    if (company) cond.company = { $regex: company, $options: 'i' };
    if (location) cond.location = { $regex: location, $options: 'i' };
    if (type) cond.employmentType = type;
    if (experience) cond.experienceLevel = experience;

    const totalJobs = await Job.countDocuments(cond);
    const jobs = await Job.find(cond).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(Number(limit));
    res.json({ totalJobs, page: Number(page), pages: Math.ceil(totalJobs / limit), jobs });
  } catch (err) { next(err); }
};

exports.getJobById = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: 'Job not found' });
    res.json(job);
  } catch (err) { next(err); }
};

exports.createJob = async (req, res, next) => {
  try { res.status(201).json(await Job.create(req.body)); } catch (err) { next(err); }
};

exports.updateJob = async (req, res, next) => {
  try { res.json(await Job.findByIdAndUpdate(req.params.id, req.body, { new: true })); } catch (err) { next(err); }
};

exports.deleteJob = async (req, res, next) => {
  try { await Job.findByIdAndDelete(req.params.id); res.json({ message: 'Job deleted' }); } catch (err) { next(err); }
};

