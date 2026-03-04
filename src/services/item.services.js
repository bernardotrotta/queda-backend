import { mongoose } from 'mongoose'
import { Item, Queue } from '../models/queue.model.js'
import { computeAverageServingTime } from './queue.services.js'
import { AuthError, NotFoundError } from '../errors/errors.js'

function fetchItem(queueId, itemId) {
    return Item.find({ _id: itemId, queueId: queueId }).exec()
}

function fetchUserItems(userId) {
    return Item.find({ userId: userId }).exec()
}

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

async function updateItemStatus(userId, itemId, newStatus) {
    const item = await Item.findById(itemId).exec()

    if (!item) {
        throw new NotFoundError('Item not found')
    }

    console.log(item)

    if (item.userId.toString() !== userId) {
        throw new AuthError('Unauthorized')
    }

    item.status = newStatus

    await item.save()
}

async function currentServingStartTime(itemId) {
    const item = await Item.findById(itemId).exec()
    return item.startedServingAt
}

async function currentElapsedTime(queueId) {
    const item = await Item.findOne({ queueId, status: 'serving' }, { startedServingAt: 1 })
        .lean()
        .exec()

    if (!item) {
        throw new Error('No item currently being served')
    }

    return Date.now() - item.startedServingAt
}

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
