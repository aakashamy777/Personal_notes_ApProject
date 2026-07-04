// Global error handling middleware — logic will be added in Stage 2
const errorHandler = (err, req, res, next) => {
  // TODO: Implement error handling
  res.status(500).json({ error: 'Internal Server Error' });
};

module.exports = errorHandler;
