import { Item, Queue } from '../models/queue.model.js'

async function createQueue(user, name) {
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

async function enqueue(queueId, ticket, payload) {
    return await Item.create({
        queueId: queueId,
        ticket: ticket,
        payload: payload,
    })
}

async function dequeue(queueId) {
    return await Item.findOneAndUpdate(
        { queueId: queueId, status: 'waiting' },
        { status: 'serving' },
        { sort: { createdAt: 1 }, returnDocument: 'after' },
    )
}

async function fetchAllQueues() {
    return await Queue.find().exec()
}

async function fetchUserQueues(userId) {
    return await Queue.find({ ownerId: userId }).exec()
}

async function fetchQueueItems(queueId) {
    return await Item.find({ queueId: queueId }).exec()
}

async function deleteQueue(queueId) {
    return await Queue.deleteOne({ _id: queueId })
}

export {
    enqueue,
    dequeue,
    fetchUserQueues,
    createQueue,
    fetchAllQueues,
    deleteQueue,
    fetchQueueItems,
}
