import { Queue } from '../models/queue.model.js'

async function enqueue(users) {
    try {
        await Queue.create(users)
    } catch (e) {
        throw e
    }
}

async function dequeue() {
    return await Queue.findOne().sort({ createdAt: 1 })
}

async function showQueue() {
    return await Queue.find()
}

export { enqueue, dequeue, showQueue }
