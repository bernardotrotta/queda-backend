/**
 * Base error class for application-specific errors.
 */
class AppError extends Error {
    /**
     * @param {string} message - Human-readable error message.
     * @param {number} [status=500] - HTTP status code associated with the error.
     * @param {any} [details] - Optional additional error metadata.
     */
    constructor(message, status = 500, details) {
        super(message)
        this.status = status
        this.details = details
    }
}

/**
 * Error thrown when input data fails validation.
 * HTTP 400 Bad Request.
 */
class ValidationError extends AppError {
    /**
     * @param {string} message - Error message.
     * @param {any} [details] - Validation error details.
     */
    constructor(message, details) {
        super(message, 400, details)
    }
}

/**
 * Error thrown when a requested operation conflicts with existing state.
 * HTTP 409 Conflict.
 */
class ConflictError extends AppError {
    /**
     * @param {string} message - Error message.
     * @param {any} [details] - Conflict details.
     */
    constructor(message, details) {
        super(message, 409, details)
    }
}

/**
 * Error thrown when authentication fails.
 * HTTP 401 Unauthorized.
 */
class AuthError extends AppError {
    /**
     * @param {string} message - Error message.
     * @param {any} [details] - Auth failure details.
     */
    constructor(message, details) {
        super(message, 401, details)
    }
}

/**
 * Error thrown when a requested resource is not found.
 * HTTP 404 Not Found.
 */
class NotFoundError extends AppError {
    /**
     * @param {string} message - Error message.
     * @param {any} [details] - Details on why it was not found.
     */
    constructor(message, details) {
        super(message, 404, details)
    }
}

export { AppError, ValidationError, ConflictError, AuthError, NotFoundError }
