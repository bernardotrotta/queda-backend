import express from 'express'
import { auth } from '../middlewares/auth.middleware.js'
import { getUserQueues } from '../controllers/user.controller.js'
import { deleteUserQueue } from '../controllers/user.controller.js'
const router = express.Router()

router.get('/:userId/queues', auth, getUserQueues)
router.delete('/:userId/queues/:queueId', auth, deleteUserQueue)

export default router
