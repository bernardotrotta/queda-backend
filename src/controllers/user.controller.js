import { AuthError } from '../errors/index.js'
import { fetchUserQueues, deleteQueue } from '../services/queue.services.js'

const getUserQueues = async (req, res, next) => {
    try {
        if (req.user != req.params.userId) throw new AuthError('Error')
        const queues = await fetchUserQueues(req.params.userId)
        res.json({ queues: queues })
    } catch (e) {
        next(e)
    }
}

const deleteUserQueue = async (req, res, next) => {
    try {
        await deleteQueue(req.params.queueId)
        res.json({ message: 'Success' })
    } catch (e) {
        next(e)
    }
}

export { getUserQueues, deleteUserQueue }
