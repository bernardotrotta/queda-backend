import express from 'express'
import { auth } from '../middlewares/auth.middleware.js'
import {
    getUserQueues,
    getUserInfo,
    deleteUserAccount,
    getAllUsers,
} from '../controllers/user.controller.js'

const router = express.Router()

router.get('/', auth, getAllUsers)
router.get('/me', auth, getUserInfo)
//router.patch('/me', auth, updateUserInfo)
router.delete('/me', auth, deleteUserAccount)
router.get('/me/queues', auth, getUserQueues)

export default router
