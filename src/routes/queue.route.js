import {
    getAllQueues,
    createQueue,
    enqueue,
    dequeue,
    getQueueItems,
    deleteQueue,
} from '../controllers/queue.controller.js'
import { auth } from '../middlewares/auth.middleware.js'

import express from 'express'
const router = express.Router()

router.post('/', auth, createQueue)
router.get('/', getAllQueues)
router.get('/:queueId/items', getQueueItems)
router.post('/:queueId/items', enqueue)
router.patch('/:queueId/items', auth, dequeue)
router.delete('/:queueId', auth, deleteQueue)

export default router
