import { fetchUserQueues } from '../services/queue.services.js'
import {
    fetchUserInfo,
    deleteUser,
    fetchAllUsers,
} from '../services/user.services.js'
import { SuccessMessage } from '../utils/messages.js'

const getUserQueues = async (req, res, next) => {
    try {
        const queues = await fetchUserQueues(req.user)
        res.json(new SuccessMessage(queues))
    } catch (error) {
        next(error)
    }
}

const getUserInfo = async (req, res, next) => {
    try {
        const user = await fetchUserInfo(req.user)
        res.json(new SuccessMessage(user))
    } catch (error) {
        next(error)
    }
}

const deleteUserAccount = async (req, res, next) => {
    try {
        await deleteUser(req.user)
        res.json(new SuccessMessage())
    } catch (error) {
        next(error)
    }
}

const getAllUsers = async (req, res, next) => {
    try {
        const users = await fetchAllUsers()
        res.json(new SuccessMessage(users))
    } catch (error) {
        next(error)
    }
}

export { getUserQueues, getUserInfo, deleteUserAccount, getAllUsers }
