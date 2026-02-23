import { Item, Queue } from '../models/queue.model.js'
import mongoose from 'mongoose'
import { AuthError } from '../utils/errors.js'

function insertQueue(user, name, servingTimeEstimationMs) {
    return Queue.create({
        ownerId: user,
        name: name,
        active: true,
        servingTimeEstimation: servingTimeEstimationMs,
    })
}

function enqueueItem(queueId, ticket, payload, servingTimeEstimationMs) {
    return Item.create({
        queueId: queueId,
        ticket: ticket,
        payload: payload,
        servingTimeEstimation: servingTimeEstimationMs,
    })
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

function fetchAllQueues() {
    return Queue.find(
        {},
        { name: 1, ownerId: 1, active: 1, servingTimeEstimation: 1 },
    ).exec()
}

function fetchUserQueues(userId) {
    return Queue.find({ ownerId: userId }).exec()
}

function fetchQueueItems(queueId) {
    return Item.find({ queueId }).exec()
}

async function fetchServingTime(queueId) {
    return Item.findOne(
        { queueId, status: 'served' },
        { startedServingAt: 1, updatedAt: 1 },
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

async function estimatedTimeMs(queueId) {
    const lastServedItem = await fetchServingTime(queueId)
    if (!lastServedItem) throw new Error('Errore')
    const lastServingTime =
        lastServedItem.updatedAt - lastServedItem.startedServingAt
    const a = 1 / 2

    const estimation =
        a * lastServingTime + (1 - a) * lastServedItem.servingTimeEstimation
    return estimation
}

export {
    enqueueItem,
    dequeueItem,
    fetchUserQueues,
    insertQueue,
    fetchAllQueues,
    removeQueue,
    fetchQueueItems,
    fetchServingTime,
    estimatedTimeMs,
}
