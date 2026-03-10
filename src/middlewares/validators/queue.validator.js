import { body, param } from 'express-validator'

/**
 * Validates that queueId is present in route parameters.
 * @returns {Object} Express-validator param check.
 */
const queueIdChain = () =>
    param('queueId').notEmpty().withMessage('QueueID is required')

/**
 * Validates that itemId is present in route parameters.
 * @returns {Object} Express-validator param check.
 */
const itemIdChain = () =>
    param('itemId').notEmpty().withMessage('ItemID is required')

/**
 * Validates that queue name is present in request body.
 * @returns {Object} Express-validator body check.
 */
const queueNameChain = () =>
    body('name').notEmpty().withMessage('A name for the queue is required')

export { queueIdChain, itemIdChain, queueNameChain }
