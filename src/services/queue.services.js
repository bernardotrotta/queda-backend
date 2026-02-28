import { Item, Queue } from '../models/queue.model.js'
import mongoose from 'mongoose'
import { AuthError } from '../errors/errors.js'

function insertQueue(user, name, averageServingTime) {
    return Queue.create({
        ownerId: user,
        name: name,
        active: true,
        averageServingTime: averageServingTime,
    })
}

function fetchQueue(queueId) {
    return Queue.findById(queueId)
}

function fetchAllQueues() {
    return Queue.find().exec()
}

function fetchUserQueues(userId) {
    return Queue.find({ ownerId: userId }).exec()
}

function fetchQueueItems(queueId) {
    return Item.find({ queueId: queueId }).exec()
}

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
