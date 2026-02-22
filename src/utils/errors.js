class AppError extends Error {
    constructor(message, status = 500, details) {
        super(message)
        this.status = status
        this.details = details
    }
}

class ValidationError extends AppError {
    constructor(message, details) {
        super(message, 400, details)
    }
}

class ConflictError extends AppError {
    constructor(message, details) {
        super(message, 409, details)
    }
}

class AuthError extends AppError {
    constructor(message, details) {
        super(message, 401, details)
    }
}

export { AppError, ValidationError, ConflictError, AuthError }
