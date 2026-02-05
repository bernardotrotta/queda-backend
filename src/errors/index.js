export class AppError extends Error {
    constructor(message, status = 500, details) {
        super(message)
        this.status = status
        this.details = details
    }
}

export class ValidationError extends AppError {
    constructor(message, details) {
        super(message, 400, details)
    }
}

export class ConflictError extends AppError {
    constructor(message, details) {
        super(message, 409, details)
    }
}

export class AuthError extends AppError {
    constructor(message, details) {
        super(message, 401, details)
    }
}
