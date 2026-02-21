import {
    getAllQueues,
    newQueue,
    enqueueItem,
    dequeueItem,
    getQueueItems,
} from '../controllers/queue.controller.js'
import { auth } from '../middlewares/auth.middleware.js'

import express from 'express'
const router = express.Router()

router.get('/', getAllQueues)
router.post('/', newQueue)
router.get('/:queueId/items', getQueueItems)
router.post('/:queueId/items', enqueueItem)
router.patch('/:queueId/items', auth, dequeueItem)

export default router
