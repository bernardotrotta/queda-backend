import {
    fetchUserItems,
    waitingTime,
    currentElapsedTime,
    updateItemStatus,
} from '../services/item.services.js'
import { SuccessMessage } from '../messages/messages.js'

/**
 * Retrieves the estimated waiting time for a specific queue item.
 * 
 * @param {Object} req - Express request object containing itemId in parameters.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 * @returns {Promise<void>} Sends a success message with estimated waiting time or passes error to next middleware.
 */
const getWaitingTime = async (req, res, next) => {
    try {
        const { itemId } = req.params
        const estimatedWaitingTime = await waitingTime(itemId)
        res.json(
            new SuccessMessage({
                'estimated time': estimatedWaitingTime,
            }),
        )
    } catch (error) {
        next(error)
    }
}

/**
 * Handles a user quitting from a specific queue.
 * 
 * @param {Object} req - Express request object containing itemId in parameters and user information.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 * @returns {Promise<void>} Sends a success message or passes error to next middleware.
 */
const quitQueue = async (req, res, next) => {
    try {
        const { itemId } = req.params
        const userId = req.user.id

        await updateItemStatus(userId, itemId, 'quit')
        res.json(new SuccessMessage())
    } catch (error) {
        next(error)
    }
}

/**
 * Retrieves the current elapsed time for a specific queue item.
 * 
 * @param {Object} req - Express request object containing itemId in parameters.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 * @returns {Promise<void>} Sends the elapsed time or passes error to next middleware.
 */
const getElaspedTime = async (req, res, next) => {
    try {
        const { itemId } = req.params
        const elapsedTime = await currentElapsedTime(itemId)
        res.json({ elapsedTime: elapsedTime })
    } catch (error) {
        next(error)
    }
}

/**
 * Retrieves all queue items associated with the authenticated user.
 * 
 * @param {Object} req - Express request object containing user information.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 * @returns {Promise<void>} Sends a success message with the user's queue items or passes error to next middleware.
 */
const getUserItems = async (req, res, next) => {
    try {
        const userId = req.user.id
        const items = await fetchUserItems(userId)
        res.json(new SuccessMessage({ items: items }))
    } catch (error) {
        next(error)
    }
}

export { getWaitingTime, getUserItems, getElaspedTime, quitQueue }
