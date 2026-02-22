import jwt from 'jsonwebtoken'
import { AuthError } from '../utils/errors.js'

const auth = (req, res, next) => {
    const token = req.headers.authorization
    if (!token) throw new AuthError('Token not found')

    const decoded = jwt.verify(token.split(' ')[1], process.env.JWT_SECRET)

    req.user = decoded.id
    next()
}

export { auth }
