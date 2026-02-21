import { signUser, loginUser } from '../services/auth.services.js'

const signUp = async (req, res, next) => {
    try {
        await signUser(req.body)
        res.json({ message: 'Account created' })
    } catch (e) {
        next(e)
    }
}

const login = async (req, res, next) => {
    try {
        const token = await loginUser(req.body)
        res.json({ token })
    } catch (e) {
        next(e)
    }
}

export { signUp, login }
