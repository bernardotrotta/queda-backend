import express from 'express'
import { getWaitingTime } from '../controllers/item.controller.js'
const router = express.Router()

/**
 * Route to get estimated waiting time for a specific item.
 * GET /api/items/:itemId/waitingTime
 */
router.get('/:itemId/waitingTime', getWaitingTime)

export default router
