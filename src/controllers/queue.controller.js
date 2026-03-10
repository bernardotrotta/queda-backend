import {
    fetchAllQueues,
    insertQueue,
    fetchQueueItems,
    removeQueue,
    fetchQueue,
} from '../services/queue.services.js'
import { enqueueItem, dequeueItem } from '../services/item.services.js'
import { SuccessMessage } from '../messages/messages.js'

/**
 * Retrieves all available queues.
 * 
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 * @returns {Promise<void>} Sends a success message with all queues or passes error to next middleware.
 */
const getAllQueues = async (req, res, next) => {
    try {
        const queues = await fetchAllQueues()
        res.json(new SuccessMessage({ queues: queues }))
    } catch (error) {
        next(error)
    }
}

/**
 * Retrieves details of a specific queue.
 * 
 * @param {Object} req - Express request object containing queueId in parameters.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 * @returns {Promise<void>} Sends a success message with the queue details or passes error to next middleware.
 */
const getQueue = async (req, res, next) => {
    try {
        const { queueId } = req.params
        const queue = await fetchQueue(queueId)
        res.json(new SuccessMessage({ queue: queue }))
    } catch (error) {
        next(error)
    }
}

/**
 * Creates a new queue.
 * 
 * @param {Object} req - Express request object containing name and averageServingTime in body, and user info.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 * @returns {Promise<void>} Sends a success message or passes error to next middleware.
 */
const createQueue = async (req, res, next) => {
    try {
        const { name, averageServingTime } = req.body
        await insertQueue(req.user.id, name, averageServingTime)
        res.json(new SuccessMessage())
    } catch (error) {
        next(error)
    }
}

/**
 * Adds a user to a specific queue.
 * 
 * @param {Object} req - Express request object containing queueId in parameters, and payload/servingTimeEstimationMs in body.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 * @returns {Promise<void>} Sends a success message or passes error to next middleware.
 */
const enqueue = async (req, res, next) => {
    try {
        const { queueId } = req.params
        const { payload, servingTimeEstimationMs } = req.body
        await enqueueItem(queueId, req.user.id, payload, servingTimeEstimationMs)
        res.json(new SuccessMessage())
    } catch (error) {
        next(error)
    }
}

/**
 * Removes the next user from a specific queue.
 * 
 * @param {Object} req - Express request object containing queueId in parameters.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 * @returns {Promise<void>} Sends a success message with the dequeued item or passes error to next middleware.
 */
const dequeue = async (req, res, next) => {
    try {
        const { queueId } = req.params
        const item = await dequeueItem(queueId)
        res.json(new SuccessMessage(new SuccessMessage({ dequeued: item })))
    } catch (error) {
        next(error)
    }
}

/**
 * Retrieves all items currently in a specific queue.
 * 
 * @param {Object} req - Express request object containing queueId in parameters.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 * @returns {Promise<void>} Sends a success message with the queue items or passes error to next middleware.
 */
const getQueueItems = async (req, res, next) => {
    try {
        const { queueId } = req.params
        const queue = await fetchQueueItems(queueId)
        res.json(new SuccessMessage(new SuccessMessage({ items: queue })))
    } catch (error) {
        next(error)
    }
}

/**
 * Deletes a specific queue.
 * 
 * @param {Object} req - Express request object containing queueId in parameters and user info.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 * @returns {Promise<void>} Sends a success message or passes error to next middleware.
 */
const deleteQueue = async (req, res, next) => {
    try {
        const { queueId } = req.params
        await removeQueue(queueId, req.user.id)
        res.json(new SuccessMessage())
    } catch (error) {
        next(error)
    }
}

export { getAllQueues, createQueue, enqueue, dequeue, getQueueItems, deleteQueue, getQueue }
