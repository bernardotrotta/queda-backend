import { changePassword, changeUsername } from '../services/auth.services.js'
import { fetchUserQueues } from '../services/queue.services.js'
import { fetchUserInfo, deleteUser, fetchAllUsers } from '../services/user.services.js'
import { SuccessMessage } from '../messages/messages.js'

/**
 * Retrieves all queues owned by the authenticated user.
 * 
 * @param {Object} req - Express request object containing user info.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 * @returns {Promise<void>} Sends a success message with the user's queues or passes error to next middleware.
 */
const getUserQueues = async (req, res, next) => {
    try {
        const userId = req.user.id
        const queues = await fetchUserQueues(userId)
        res.json(new SuccessMessage({ queues: queues }))
    } catch (error) {
        next(error)
    }
}

/**
 * Updates the authenticated user's information (username or password).
 * 
 * @param {Object} req - Express request object containing type, username, and password in body.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 * @returns {Promise<void>} Sends a success message or passes error to next middleware.
 */
const updateUserInfo = async (req, res, next) => {
    try {
        const userId = req.user.id
        const { username, password, type } = req.body
        if (type === 'password') {
            await changePassword(userId, password)
        }
        if (type === 'username') {
            await changeUsername(userId, username)
        }
        res.json(new SuccessMessage())
    } catch (error) {
        next(error)
    }
}

/**
 * Retrieves information for the authenticated user.
 * 
 * @param {Object} req - Express request object containing user info.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 * @returns {Promise<void>} Sends a success message with user details or passes error to next middleware.
 */
const getUserInfo = async (req, res, next) => {
    try {
        const user = await fetchUserInfo(req.user.id)
        res.json(new SuccessMessage({ user: user }))
    } catch (error) {
        next(error)
    }
}

/**
 * Deletes the authenticated user's account.
 * 
 * @param {Object} req - Express request object containing user info.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 * @returns {Promise<void>} Sends a success message or passes error to next middleware.
 */
const deleteUserAccount = async (req, res, next) => {
    try {
        await deleteUser(req.user.id)
        res.json(new SuccessMessage())
    } catch (error) {
        next(error)
    }
}

/**
 * Retrieves all registered users.
 * 
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 * @returns {Promise<void>} Sends a success message with all users or passes error to next middleware.
 */
const getAllUsers = async (req, res, next) => {
    try {
        const users = await fetchAllUsers()
        res.json(new SuccessMessage({ users: users }))
    } catch (error) {
        next(error)
    }
}

export { getUserQueues, getUserInfo, deleteUserAccount, getAllUsers, updateUserInfo }
