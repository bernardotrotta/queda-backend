import { Item, Queue } from '../models/queue.model.js'
import mongoose from 'mongoose'
import { AuthError } from '../utils/errors.js'

function insertQueue(user, name, servingTimeEstimationMs) {
    return Queue.create({
        ownerId: user,
        name: name,
        active: true,
        defaultServingTimeEstimation: servingTimeEstimationMs,
    })
}

async function enqueueItem(queueId, payload, servingTimeEstimationMs) {
    const session = await mongoose.startSession()
    session.startTransaction()
    try {
        const queue = await Queue.findOneAndUpdate(
            { _id: queueId },
            { $inc: { counter: 1 } },
            { returnDocument: 'after', session },
        )

        console.log(queue)
        console.log(queue?.counter)
        console.log(queueId)
        console.log(servingTimeEstimationMs)

        await Item.create(
            [
                {
                    queueId: queueId,
                    ticket: queue.counter,
                    payload: payload,
                    servingTimeEstimation: servingTimeEstimationMs,
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
    return Queue.find().exec()
}

function fetchUserQueues(userId) {
    return Queue.find({ ownerId: userId }).exec()
}

function fetchQueueItems(queueId) {
    return Item.find({ queueId }).exec()
}

async function fetchLastServedItem(queueId) {
    return Item.findOne(
        { queueId, status: 'served' },
        { startedServingAt: 1, servedAt: 1, servingTimeEstimation: 1 },
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
    const a = 1 / 2
    const lastServedItem = await fetchLastServedItem(queueId)
    if (!lastServedItem) {
        const defaultServingTimeEstimation = await Queue.findOne(
            { _id: queueId },
            { _id: 0, defaultServingTimeEstimation: 1 },
        )
            .lean()
            .exec()
        return defaultServingTimeEstimation
    }
    const { servingTimeEstimation, servedAt, startedServingAt } =
        lastServedItem.toJSON()
    const lastServingTime = servedAt - startedServingAt

    console.log(lastServedItem)
    return {
        estimatedTime: a * lastServingTime + (1 - a) * servingTimeEstimation,
    }
}

export {
    enqueueItem,
    dequeueItem,
    fetchUserQueues,
    insertQueue,
    fetchAllQueues,
    removeQueue,
    fetchQueueItems,
    fetchLastServedItem,
    estimatedTimeMs,
}
