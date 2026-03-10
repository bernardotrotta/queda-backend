import { Item, Queue } from '../models/queue.model.js'
import mongoose from 'mongoose'
import { AuthError, NotFoundError } from '../errors/errors.js'

/**
 * Creates a new queue.
 * 
 * @param {string} user - The unique identifier of the user who owns the queue.
 * @param {string} name - The name of the queue.
 * @param {number} averageServingTime - The initial average serving time in milliseconds.
 * @returns {Promise<Object>} The created queue document.
 */
function insertQueue(user, name, averageServingTime) {
    return Queue.create({
        ownerId: user,
        name: name,
        active: true,
        averageServingTime: averageServingTime,
    })
}

/**
 * Fetches a specific queue by its identifier.
 * 
 * @param {string} queueId - The unique identifier of the queue.
 * @throws {NotFoundError} If the queue does not exist.
 * @returns {Promise<Object>} The queue document.
 */
async function fetchQueue(queueId) {
    const queue = await Queue.findById(queueId).exec()
    if (!queue) throw new NotFoundError('Queue not found')
    return queue
}

/**
 * Fetches all available queues in the system.
 * 
 * @returns {Promise<Array>} An array of all queue documents.
 */
async function fetchAllQueues() {
    return await Queue.find().exec()
}

/**
 * Fetches all queues owned by a specific user.
 * 
 * @param {string} userId - The unique identifier of the user.
 * @returns {Promise<Array>} An array of queue documents owned by the user.
 */
function fetchUserQueues(userId) {
    return Queue.find({ ownerId: userId }).exec()
}

/**
 * Fetches all items currently associated with a specific queue.
 * 
 * @param {string} queueId - The unique identifier of the queue.
 * @returns {Promise<Array>} An array of items in the queue.
 */
function fetchQueueItems(queueId) {
    return Item.find({ queueId: queueId }).exec()
}

/**
 * Fetches the most recently served item from a specific queue.
 * 
 * @param {string} queueId - The unique identifier of the queue.
 * @returns {Promise<Object|null>} The last served item or null if none.
 */
async function fetchLastServedItem(queueId) {
    return Item.findOne(
        { queueId, status: 'served' },
        {
            startedServingAt: 1,
            servedAt: 1,
            ticket: 1,
        },
        { sort: { updatedAt: -1 } },
    ).exec()
}

/**
 * Deletes a specific queue and all its associated items.
 * 
 * @param {string} queueId - The unique identifier of the queue.
 * @param {string} userId - The unique identifier of the user requesting deletion.
 * @throws {Error} If the queue is not found.
 * @throws {AuthError} If the user is not the owner of the queue.
 * @returns {Promise<Object>} Object indicating deletion status.
 */
async function removeQueue(queueId, userId) {
    const session = await mongoose.startSession()
    session.startTransaction()

    try {
        const queue = await Queue.findById(queueId).session(session)
        if (!queue) throw new Error('Queue not found')

        if (queue.ownerId.toString() !== userId.toString()) {
            throw new AuthError('You must be the owner to delete a queue')
        }

        await Item.deleteMany({ queueId }).session(session)
        await Queue.deleteOne({ _id: queueId }).session(session)

        await session.commitTransaction()
        return { deleted: true }
    } catch (error) {
        await session.abortTransaction()
        throw error
    } finally {
        session.endSession()
    }
}

/**
 * Recomputes the average serving time for a queue using an exponential moving average.
 * 
 * @param {string} queueId - The unique identifier of the queue.
 * @returns {Promise<number>} The updated average serving time in milliseconds.
 */
async function computeAverageServingTime(queueId) {
    const a = 0.4
    const lastServedItem = await fetchLastServedItem(queueId)
    const { averageServingTime } = await Queue.findOne(
        { _id: queueId },
        { _id: 0, averageServingTime: 1 },
    ).lean()

    if (!lastServedItem) {
        return averageServingTime
    }

    const lastServingTime = lastServedItem.servedAt - lastServedItem.startedServingAt

    return Math.round(a * lastServingTime + (1 - a) * averageServingTime)
}

export {
    fetchUserQueues,
    insertQueue,
    fetchAllQueues,
    removeQueue,
    fetchQueueItems,
    computeAverageServingTime,
    fetchQueue,
}
