import {
    fetchAllQueues,
    insertQueue,
    fetchQueueItems,
    removeQueue,
    fetchQueue,
} from '../services/queue.services.js'
import { enqueueItem, dequeueItem } from '../services/item.services.js'
import { SuccessMessage } from '../messages/messages.js'

const getAllQueues = async (req, res, next) => {
    try {
        const queues = await fetchAllQueues()
        res.json(new SuccessMessage({ queues: queues }))
    } catch (error) {
        next(error)
    }
}

const getQueue = async (req, res, next) => {
    try {
        const { queueId } = req.params
        const queue = await fetchQueue(queueId)
        res.json(new SuccessMessage({ queue: queue }))
    } catch (error) {
        next(error)
    }
}

const createQueue = async (req, res, next) => {
    try {
        const { name, averageServingTime } = req.body
        await insertQueue(req.user.id, name, averageServingTime)
        res.json(new SuccessMessage())
    } catch (error) {
        next(error)
    }
}

const enqueue = async (req, res, next) => {
    try {
        const { queueId } = req.params
        const { payload, servingTimeEstimationMs } = req.body
        await enqueueItem(queueId, req.user.id, payload, servingTimeEstimationMs)
        res.json(new SuccessMessage())
    } catch (error) {
        next(error)
    }
}

const dequeue = async (req, res, next) => {
    try {
        const { queueId } = req.params
        const item = await dequeueItem(queueId)
        res.json(new SuccessMessage(new SuccessMessage({ dequeued: item })))
    } catch (error) {
        next(error)
    }
}

const getQueueItems = async (req, res, next) => {
    try {
        const { queueId } = req.params
        const queue = await fetchQueueItems(queueId)
        res.json(new SuccessMessage(new SuccessMessage({ items: queue })))
    } catch (error) {
        next(error)
    }
}

const deleteQueue = async (req, res, next) => {
    try {
        const { queueId } = req.params
        await removeQueue(queueId, req.user.id)
        res.json(new SuccessMessage())
    } catch (error) {
        next(error)
    }
}

export { getAllQueues, createQueue, enqueue, dequeue, getQueueItems, deleteQueue, getQueue }
