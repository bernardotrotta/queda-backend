import { signUser, loginUser } from '../services/auth.services.js'
import { SuccessMessage } from '../messages/messages.js'

/**
 * Handles user registration.
 * 
 * @param {Object} req - Express request object containing email, username, and password in body.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 * @returns {Promise<void>} Sends a success message on successful registration or passes error to next middleware.
 */
const signUp = async (req, res, next) => {
    try {
        const { email, username, password } = req.body
        await signUser(email, username, password)
        res.json(new SuccessMessage())
    } catch (e) {
        next(e)
    }
}

/**
 * Handles user login.
 * 
 * @param {Object} req - Express request object containing email and password in body.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 * @returns {Promise<void>} Sends a success message with an auth token or passes error to next middleware.
 */
const login = async (req, res, next) => {
    try {
        const { email, password } = req.body
        const token = await loginUser(email, password)
        res.json(new SuccessMessage({ token: token }))
    } catch (e) {
        next(e)
    }
}

export { signUp, login }
