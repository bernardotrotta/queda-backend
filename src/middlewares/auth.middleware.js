import jwt from 'jsonwebtoken'
import { AuthError } from '../errors/errors.js'

/**
 * Middleware to verify JWT token from the Authorization header.
 * 
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 * @throws {AuthError} If no token is provided.
 * @returns {void} Sets req.user with decoded token and calls next middleware.
 */
const auth = (req, res, next) => {
    const token = req.headers.authorization
    if (!token) throw new AuthError('Token not found')
    const decoded = jwt.verify(token.split(' ')[1], process.env.JWT_SECRET)
    req.user = decoded
    next()
}

export { auth }
