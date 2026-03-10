/**
 * Global error handling middleware.
 * 
 * @param {Error} err - Error object.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} _next - Express next middleware function (unused).
 * @returns {void} Sends a JSON error response with appropriate status code.
 */
const errorHandler = (err, req, res, _next) => {
    res.status(err.status || 500).json({
        error: err.message,
        details: err.details,
    })
}

export { errorHandler }
