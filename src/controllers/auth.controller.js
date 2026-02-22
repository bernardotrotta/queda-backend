import { signUser, loginUser } from '../services/auth.services.js'
import { SuccessMessage } from '../utils/messages.js'

const signUp = async (req, res, next) => {
    try {
        await signUser(req.body)
        res.json(new SuccessMessage())
    } catch (e) {
        next(e)
    }
}

const login = async (req, res, next) => {
    try {
        const token = await loginUser(req.body)
        res.json(new SuccessMessage(token))
    } catch (e) {
        next(e)
    }
}

export { signUp, login }
