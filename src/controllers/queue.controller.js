import {
    fetchAllQueues,
    insertQueue,
    enqueueItem,
    dequeueItem,
    fetchQueueItems,
    removeQueue,
} from '../services/queue.services.js'
import { SuccessMessage } from '../utils/messages.js'

const getAllQueues = async (req, res, next) => {
    try {
        const queues = await fetchAllQueues()
        res.json(new SuccessMessage(queues))
    } catch (e) {
        next(e)
    }
}

const createQueue = async (req, res, next) => {
    try {
        const { name } = req.body
        await insertQueue(req.user, name)
        res.json(new SuccessMessage())
    } catch (error) {
        next(error)
    }
}

const enqueue = async (req, res, next) => {
    try {
        const { queueId } = req.params
        const { ticket, payload } = req.body
        await enqueueItem(queueId, ticket, payload)
        res.json(new SuccessMessage())
    } catch (error) {
        next(error)
    }
}

const dequeue = async (req, res, next) => {
    try {
        const { queueId } = req.params
        const item = await dequeueItem(queueId)
        res.json(new SuccessMessage(item))
    } catch (error) {
        next(error)
    }
}

const getQueueItems = async (req, res, next) => {
    try {
        const { queueId } = req.params
        const queue = await fetchQueueItems(queueId)
        res.json(new SuccessMessage(queue))
    } catch (error) {
        next(error)
    }
}

const deleteQueue = async (req, res, next) => {
    try {
        const { queueId } = req.params
        await removeQueue(queueId, req.user)
        res.json(new SuccessMessage())
    } catch (error) {
        next(error)
    }
}

export {
    getAllQueues,
    createQueue,
    enqueue,
    dequeue,
    getQueueItems,
    deleteQueue,
}
