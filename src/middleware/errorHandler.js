const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  // Express-validator errors
  if (err.array && typeof err.array === 'function') {
    return res.status(400).json({ error: err.array()[0].msg });
  }

  // Prisma known request errors
  if (err.code === 'P2002') {
    return res.status(409).json({ error: 'A record with this value already exists' });
  }

  if (err.code === 'P2025') {
    return res.status(404).json({ error: 'Record not found' });
  }

  if (err.code === 'P2003') {
    return res.status(400).json({ error: 'Related record not found' });
  }

  // Prisma validation error
  if (err.name === 'PrismaClientValidationError') {
    return res.status(400).json({ error: 'Invalid data provided' });
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({ error: 'Invalid token' });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({ error: 'Token expired' });
  }

  // Syntax error (malformed JSON body)
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ error: 'Invalid JSON in request body' });
  }

  // Default
  const statusCode = err.status || 500;
  res.status(statusCode).json({
    error: statusCode === 500 ? 'Internal Server Error' : err.message,
  });
};

module.exports = errorHandler;
