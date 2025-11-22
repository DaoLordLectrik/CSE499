/**
 * Error Handling Middleware
 * Catches and formats errors for consistent API responses
 */

/**
 * Global error handler
 * Catches all errors and sends formatted response
 */
const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  // Determine status code
  const statusCode = err.statusCode || 500;

  // Send error response
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

/**
 * 404 Not Found handler
 * Handles requests to non-existent routes
 */
const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

module.exports = {
  errorHandler,
  notFound
};