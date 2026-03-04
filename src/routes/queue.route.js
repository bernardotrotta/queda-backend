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

router.post('/', auth, createQueue)
router.get('/', getAllQueues)
router.get('/:queueId/items', getQueueItems)
router.post('/:queueId/items', auth, enqueue)
router.patch('/:queueId/items', auth, dequeue)
router.get('/:queueId', getQueue)
router.delete('/:queueId', auth, deleteQueue)
router.delete('/:queueId/items/:itemId', auth, quitQueue)

export default router
