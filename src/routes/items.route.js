import express from 'express'
import { getWaitingTime } from '../controllers/item.controller.js'
const router = express.Router()

router.get('/:itemId/waitingTime', getWaitingTime)

export default router
