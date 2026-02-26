import {
    fetchAllQueues,
    insertQueue,
    enqueueItem,
    dequeueItem,
    fetchQueueItems,
    removeQueue,
    estimatedTimeMs,
    fetchUserItems,
    itemRelativePosition,
} from '../services/queue.services.js'
import { SuccessMessage } from '../utils/messages.js'

const getAllQueues = async (req, res, next) => {
    try {
        const queues = await fetchAllQueues()
        res.json(new SuccessMessage({ queues: queues }))
    } catch (error) {
        next(error)
    }
}

const getServingTimeEstimationMs = async (req, res, next) => {
    const { queueId, itemId } = req.params

    try {
        const baseTime = await estimatedTimeMs(queueId)
        const relativePosition = await itemRelativePosition(itemId)
        res.json(
            new SuccessMessage({
                'estimated time': baseTime * relativePosition,
            }),
        )
    } catch (error) {
        next(error)
    }
}

const createQueue = async (req, res, next) => {
    try {
        const { name, servingTimeEstimationMs } = req.body
        console.log(servingTimeEstimationMs)
        await insertQueue(req.user, name, servingTimeEstimationMs)
        res.json(new SuccessMessage())
    } catch (error) {
        next(error)
    }
}

const getUserItems = async (req, res, next) => {
    try {
        const userId = req.user
        const items = await fetchUserItems(userId)
        res.json(new SuccessMessage({ items: items }))
    } catch (error) {
        next(error)
    }
}

const enqueue = async (req, res, next) => {
    try {
        const { queueId } = req.params
        const { payload, servingTimeEstimationMs } = req.body
        await enqueueItem(queueId, req.user, payload, servingTimeEstimationMs)
        res.json(new SuccessMessage())
    } catch (error) {
        next(error)
    }
}

const dequeue = async (req, res, next) => {
    try {
        const { queueId } = req.params
        const item = await dequeueItem(queueId)
        res.json(new SuccessMessage({ dequeued: item }))
    } catch (error) {
        next(error)
    }
}

const getQueueItems = async (req, res, next) => {
    try {
        const { queueId } = req.params
        const queue = await fetchQueueItems(queueId)
        res.json(new SuccessMessage({ items: queue }))
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
    getServingTimeEstimationMs,
    getUserItems,
}
