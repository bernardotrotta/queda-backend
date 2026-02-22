import { Item, Queue } from '../models/queue.model.js'
import mongoose from 'mongoose'
import { AuthError } from '../utils/errors.js'

async function insertQueue(user, name) {
    return await Queue.create({
        ownerId: user,
        name: name,
        active: true,
        // fieldsDefinition: {
        //     codice_priorita: {
        //         type: 'enum',
        //         options: ['rosso', 'giallo', 'verde'],
        //     },
        //     sintomi: { type: 'text' },
        // },
    })
}

async function enqueueItem(queueId, ticket, payload) {
    return await Item.create({
        queueId: queueId,
        ticket: ticket,
        payload: payload,
    })
}

async function dequeueItem(queueId) {
    const session = await mongoose.startSession()
    session.startTransaction()

    try {
        await Item.updateOne(
            { queueId, status: 'serving' },
            { $set: { status: 'served' } },
            { session },
        )

        const next = await Item.findOneAndUpdate(
            { queueId, status: 'waiting' },
            { status: 'serving' },
            { sort: { createdAt: 1 }, returnDocument: 'after' },
            { session },
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

async function fetchAllQueues() {
    return await Queue.find({}, { name: 1, ownerId: 1, active: 1 }).exec()
}

async function fetchUserQueues(userId) {
    return await Queue.findById(userId).exec()
}

async function fetchQueueItems(queueId) {
    return await Item.find({ queueId: queueId }).exec()
}

async function removeQueue(queueId, userId) {
    const session = await mongoose.startSession()
    session.startTransaction()

    try {
        const queue = await Queue.findById(queueId).session(session)
        if (!queue) throw new Error('Queue not found')
        if (queue.ownerId.toString() !== userId.toString())
            throw new AuthError('You must be the owner to delete a queue')

        await Item.deleteMany({ queueId: queueId }).session(session)
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

export {
    enqueueItem,
    dequeueItem,
    fetchUserQueues,
    insertQueue,
    fetchAllQueues,
    removeQueue,
    fetchQueueItems,
}
