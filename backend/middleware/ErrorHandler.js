const errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  if (err.code === 11000) {
    return res.status(400).json({ message: 'Duplicate submission detected: You have already applied for this role.' });
  }
  res.status(err.status || 500).json({ message: err.message || 'Central server error encountered.' });
};
module.exports = errorHandler;
