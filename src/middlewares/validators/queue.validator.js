import { body, param } from 'express-validator'

const queueIdChain = () =>
    param('queueId').notEmpty().withMessage('QueueID is required')
const itemIdChain = () =>
    param('itemId').notEmpty().withMessage('ItemID is required')
const queueNameChain = () =>
    body('name').notEmpty().withMessage('A name for the queue is required')

export { queueIdChain, itemIdChain, queueNameChain }
