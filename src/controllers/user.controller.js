import { changePassword, changeUsername } from '../services/auth.services.js'
import { fetchUserQueues } from '../services/queue.services.js'
import {
    fetchUserInfo,
    deleteUser,
    fetchAllUsers,
} from '../services/user.services.js'
import { SuccessMessage } from '../utils/messages.js'

const getUserQueues = async (req, res, next) => {
    try {
        const userId = req.user.id
        const queues = await fetchUserQueues(userId)
        res.json(new SuccessMessage({ queues: queues }))
    } catch (error) {
        next(error)
    }
}

const updateUserInfo = async (req, res, next) => {
    try {
        const userId = req.user.id
        const { username, password, type } = req.body
        if (type === 'password') {
            await changePassword(userId, password)
        }
        if (type === 'username') {
            await changeUsername(userId, username)
        }
        res.json(new SuccessMessage())
    } catch (error) {
        next(error)
    }
}

const getUserInfo = async (req, res, next) => {
    try {
        const user = await fetchUserInfo(req.user.id)
        res.json(new SuccessMessage({ user: user }))
    } catch (error) {
        next(error)
    }
}

const deleteUserAccount = async (req, res, next) => {
    try {
        await deleteUser(req.user.id)
        res.json(new SuccessMessage())
    } catch (error) {
        next(error)
    }
}

const getAllUsers = async (req, res, next) => {
    try {
        const users = await fetchAllUsers()
        res.json(new SuccessMessage({ users: users }))
    } catch (error) {
        next(error)
    }
}

export {
    getUserQueues,
    getUserInfo,
    deleteUserAccount,
    getAllUsers,
    updateUserInfo,
}
