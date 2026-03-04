import {
    fetchUserItems,
    waitingTime,
    currentElapsedTime,
    updateItemStatus,
} from '../services/item.services.js'
import { SuccessMessage } from '../messages/messages.js'

const getWaitingTime = async (req, res, next) => {
    const { itemId } = req.params

    try {
        const estimatedWaitingTime = await waitingTime(itemId)
        res.json(
            new SuccessMessage({
                'estimated time': estimatedWaitingTime,
            }),
        )
    } catch (error) {
        next(error)
    }
}

const quitQueue = async (req, res, next) => {
    try {
        const { itemId } = req.params
        console.log(itemId)
        const userId = req.user.id

        await updateItemStatus(userId, itemId, 'quit')
        res.json(new SuccessMessage())
    } catch (error) {
        next(error)
    }
}

const getElaspedTime = async (req, res, next) => {
    try {
        const { itemId } = req.params
        const elapsedTime = await currentElapsedTime(itemId)
        res.json({ elapsedTime: elapsedTime })
    } catch (error) {
        next(error)
    }
}

const getUserItems = async (req, res, next) => {
    try {
        const userId = req.user.id
        const items = await fetchUserItems(userId)
        res.json(new SuccessMessage({ items: items }))
    } catch (error) {
        next(error)
    }
}

export { getWaitingTime, getUserItems, getElaspedTime, quitQueue }
