import express from 'express'
import { auth } from '../middlewares/auth.middleware.js'
import {
    getUserQueues,
    getUserInfo,
    deleteUserAccount,
    getAllUsers,
    updateUserInfo,
} from '../controllers/user.controller.js'
import { getUserItems } from '../controllers/item.controller.js'
import {
    confirmPasswordChain,
    passwordChain,
    usernameChain,
} from '../middlewares/validators/user.validator.js'
import { dataValidation } from '../middlewares/validation.middleware.js'

const router = express.Router()

/**
 * Route to get all users. Requires authentication.
 * GET /api/users/
 */
router.get('/', auth, getAllUsers)

/**
 * Route to get the authenticated user's information. Requires authentication.
 * GET /api/users/me
 */
router.get('/me', auth, getUserInfo)

/**
 * Route to delete the authenticated user's account. Requires authentication.
 * DELETE /api/users/me
 */
router.delete('/me', auth, deleteUserAccount)

/**
 * Route to update the authenticated user's profile (username/password). Requires authentication.
 * PATCH /api/users/me
 */
router.patch(
    '/me',
    auth,
    [usernameChain(), passwordChain(), confirmPasswordChain(), dataValidation],
    updateUserInfo,
)

/**
 * Route to get the authenticated user's owned queues. Requires authentication.
 * GET /api/users/me/queues
 */
router.get('/me/queues', auth, getUserQueues)

/**
 * Route to get all queue items belonging to the authenticated user. Requires authentication.
 * GET /api/users/me/queues/items
 */
router.get('/me/queues/items', auth, getUserItems)

export default router
