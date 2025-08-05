/**
 * Error handling middleware module
 * Provides centralized error handling and 404 route handling for Express applications
 */

/**
 * Global error handling middleware for Express applications
 * @function errorHandler
 * @param {Error} err - The error object that was thrown or passed to next()
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @description Catches all unhandled errors in the application and returns a standardized
 * error response. Logs the error stack trace for debugging purposes.
 * This middleware should be registered last in the middleware chain.
 */
function errorHandler(err, req, res, next) {
  // Log the full error stack trace for debugging
  console.error(err.stack);
  
  // Send standardized error response to client
  res.status(500).json({
    success: false,
    message: 'Something went wrong!'
  });
}

/**
 * 404 Not Found handler middleware
 * @function notFoundHandler
 * @param {Object} req - Express request object containing the unmatched route
 * @param {Object} res - Express response object
 * @description Handles requests to routes that don't exist in the application.
 * Should be registered after all valid routes but before the error handler.
 * Returns a standardized 404 response.
 */
function notFoundHandler(req, res) {
  // Send 404 response for unmatched routes
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
}

/**
 * Export error handling middleware functions
 * @module errorHandler
 */
module.exports = {
  errorHandler,
  notFoundHandler
};
