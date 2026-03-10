import { validationResult } from 'express-validator'
import { ValidationError } from '../errors/errors.js'

/**
 * Middleware to check for validation errors from express-validator.
 * 
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 * @throws {ValidationError} If validation errors are present.
 * @returns {void} Calls next middleware if validation passes.
 */
const dataValidation = (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        throw new ValidationError('Missing parameters', errors)
    }
    next()
}

export { dataValidation }
