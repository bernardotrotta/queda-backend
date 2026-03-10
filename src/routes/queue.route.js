import { quitQueue } from '../controllers/item.controller.js'
import {
    getAllQueues,
    createQueue,
    enqueue,
    dequeue,
    getQueueItems,
    deleteQueue,
    getQueue,
} from '../controllers/queue.controller.js'
import { auth } from '../middlewares/auth.middleware.js'

import express from 'express'
const router = express.Router()

/**
 * Route to create a new queue. Requires authentication.
 * POST /api/queues/
 */
router.post('/', auth, createQueue)

/**
 * Route to get all available queues.
 * GET /api/queues/
 */
router.get('/', getAllQueues)

/**
 * Route to get all items in a specific queue.
 * GET /api/queues/:queueId/items
 */
router.get('/:queueId/items', getQueueItems)

/**
 * Route to join a specific queue. Requires authentication.
 * POST /api/queues/:queueId/items
 */
router.post('/:queueId/items', auth, enqueue)

/**
 * Route to dequeue (process) the next item in a queue. Requires authentication.
 * PATCH /api/queues/:queueId/items
 */
router.patch('/:queueId/items', auth, dequeue)

/**
 * Route to get details of a specific queue.
 * GET /api/queues/:queueId
 */
router.get('/:queueId', getQueue)

/**
 * Route to delete a specific queue. Requires authentication.
 * DELETE /api/queues/:queueId
 */
router.delete('/:queueId', auth, deleteQueue)

/**
 * Route for a user to quit a specific queue item. Requires authentication.
 * DELETE /api/queues/:queueId/items/:itemId
 */
router.delete('/:queueId/items/:itemId', auth, quitQueue)

export default router
