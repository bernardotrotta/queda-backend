import {
    fetchAllQueues,
    createQueue,
    enqueue,
    dequeue,
    fetchQueueItems,
} from '../services/queue.services.js'

const getAllQueues = async (req, res, next) => {
    try {
        const queues = await fetchAllQueues()
        res.json({ queues: queues })
    } catch (e) {
        next(e)
    }
}

const newQueue = async (req, res, next) => {
    try {
        const { user, name } = req.body
        await createQueue(user, name)
        res.json({ message: 'Created' })
    } catch (e) {
        next(e)
    }
}

const enqueueItem = async (req, res, next) => {
    try {
        const { queueId } = req.params
        const { ticket, payload } = req.body
        await enqueue(queueId, ticket, payload)
        res.json({ message: 'success' })
    } catch (e) {
        next(e)
    }
}

const dequeueItem = async (req, res, next) => {
    try {
        // Implementare il controllo dei campi mancanti
        const { queueId } = req.body
        const item = await dequeue(queueId)
        res.json({ item: item })
    } catch (e) {
        next(e)
    }
}

const getQueueItems = async (req, res, next) => {
    try {
        const { queueId } = req.params
        const queue = await fetchQueueItems(queueId)
        res.json({ queue: queue })
    } catch (e) {
        next(e)
    }
}

export { getAllQueues, newQueue, enqueueItem, dequeueItem, getQueueItems }
