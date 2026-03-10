import { mongoose } from 'mongoose'
import { Item, Queue } from '../models/queue.model.js'
import { computeAverageServingTime } from './queue.services.js'
import { AuthError, NotFoundError } from '../errors/errors.js'

/**
 * Fetches a specific item from a queue.
 * 
 * @param {string} queueId - The unique identifier of the queue.
 * @param {string} itemId - The unique identifier of the item.
 * @returns {Promise<Array>} The fetched item in an array.
 */
function fetchItem(queueId, itemId) {
    return Item.find({ _id: itemId, queueId: queueId }).exec()
}

/**
 * Fetches all items belonging to a specific user.
 * 
 * @param {string} userId - The unique identifier of the user.
 * @returns {Promise<Array>} An array of items belonging to the user.
 */
function fetchUserItems(userId) {
    return Item.find({ userId: userId }).exec()
}

/**
 * Adds a new item to a queue.
 * 
 * @param {string} queueId - The unique identifier of the queue.
 * @param {string} userId - The unique identifier of the user enqueuing.
 * @param {Object} payload - Additional data for the queue item.
 * @returns {Promise<void>}
 */
async function enqueueItem(queueId, userId, payload) {
    const session = await mongoose.startSession()
    session.startTransaction()
    try {
        const queue = await Queue.findOneAndUpdate(
            { _id: queueId },
            { $inc: { counter: 1 } },
            { returnDocument: 'after', session },
        )

        await Item.create(
            [
                {
                    queueId: queueId,
                    userId: userId,
                    ticket: queue.counter,
                    payload: payload,
                },
            ],
            { session },
        )

        await session.commitTransaction()
        return
    } catch (error) {
        await session.abortTransaction()
        throw error
    } finally {
        session.endSession()
    }
}

/**
 * Processes the next item in the queue (serves the next waiting user).
 * 
 * @param {string} queueId - The unique identifier of the queue.
 * @returns {Promise<Object|null>} The item that is now being served, or null if queue is empty.
 */
async function dequeueItem(queueId) {
    const session = await mongoose.startSession()
    session.startTransaction()

    try {
        await Item.updateOne(
            { queueId, status: 'serving' },
            { $set: { status: 'served', servedAt: new Date() } },
            { session },
        )

        const newAverageServingTime = await computeAverageServingTime(queueId)

        await Queue.updateOne(
            { _id: queueId },
            { $set: { averageServingTime: newAverageServingTime } },
            { session },
        )

        const next = await Item.findOneAndUpdate(
            { queueId, status: 'waiting' },
            {
                $set: {
                    status: 'serving',
                    startedServingAt: new Date(),
                },
            },
            {
                sort: { createdAt: 1 },
                returnDocument: 'after',
                session,
            },
        )

        await session.commitTransaction()
        return next
    } catch (error) {
        await session.abortTransaction()
        throw error
    } finally {
        session.endSession()
    }
}

/**
 * Updates the status of a specific item.
 * 
 * @param {string} userId - The unique identifier of the user requesting the update.
 * @param {string} itemId - The unique identifier of the item.
 * @param {string} newStatus - The new status to set for the item.
 * @throws {NotFoundError} If the item does not exist.
 * @throws {AuthError} If the user is not authorized to update the item.
 * @returns {Promise<void>}
 */
async function updateItemStatus(userId, itemId, newStatus) {
    const item = await Item.findById(itemId).exec()

    if (!item) {
        throw new NotFoundError('Item not found')
    }

    if (item.userId.toString() !== userId) {
        throw new AuthError('Unauthorized')
    }

    item.status = newStatus

    await item.save()
}

/**
 * Retrieves the time when an item started being served.
 * 
 * @param {string} itemId - The unique identifier of the item.
 * @returns {Promise<Date>} The start time of serving.
 */
async function currentServingStartTime(itemId) {
    const item = await Item.findById(itemId).exec()
    return item.startedServingAt
}

/**
 * Calculates the time elapsed since the current item in the queue started being served.
 * 
 * @param {string} queueId - The unique identifier of the queue.
 * @throws {Error} If no item is currently being served.
 * @returns {Promise<number>} Elapsed time in milliseconds.
 */
async function currentElapsedTime(queueId) {
    const item = await Item.findOne({ queueId, status: 'serving' }, { startedServingAt: 1 })
        .lean()
        .exec()

    if (!item) {
        throw new Error('No item currently being served')
    }

    return Date.now() - item.startedServingAt
}

/**
 * Estimates the waiting time for a specific item in the queue.
 * 
 * @param {string} itemId - The unique identifier of the item.
 * @returns {Promise<number>} Estimated waiting time in milliseconds.
 */
async function waitingTime(itemId) {
    const item = await Item.findById(itemId).lean().exec()
    if (!item || item.status !== 'waiting') return 0

    const [avgServiceTime, elapsed] = await Promise.all([
        computeAverageServingTime(item.queueId),
        currentElapsedTime(item.queueId),
    ])

    const peopleAhead = await Item.countDocuments({
        queueId: item.queueId,
        status: 'waiting',
        ticket: { $lt: item.ticket },
    }).exec()

    const remainingTimeCurrent = Math.max(0, avgServiceTime - elapsed)

    return remainingTimeCurrent + peopleAhead * avgServiceTime
}

export {
    dequeueItem,
    enqueueItem,
    fetchItem,
    fetchUserItems,
    currentServingStartTime,
    currentElapsedTime,
    waitingTime,
    updateItemStatus,
}
