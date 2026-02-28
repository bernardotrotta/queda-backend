import { validationResult } from 'express-validator'
import { ValidationError } from '../errors/errors.js'

const dataValidation = (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        throw new ValidationError('Missing parameters', errors)
    }
    next()
}

export { dataValidation }
