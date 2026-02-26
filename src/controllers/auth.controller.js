import { signUser, loginUser } from '../services/auth.services.js'
import { SuccessMessage } from '../utils/messages.js'

const signUp = async (req, res, next) => {
    try {
        const { email, username, password } = req.body
        await signUser(email, username, password)
        res.json(new SuccessMessage())
    } catch (e) {
        next(e)
    }
}

const login = async (req, res, next) => {
    try {
        const { email, password } = req.body
        const token = await loginUser(email, password)
        res.json(new SuccessMessage({ token: token }))
    } catch (e) {
        next(e)
    }
}

export { signUp, login }
