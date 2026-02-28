import bcrypt from 'bcrypt'
import { User } from '../models/user.model.js'
import { ConflictError, AuthError } from '../errors/errors.js'
import jwt from 'jsonwebtoken'

process.loadEnvFile()

async function changePassword(userId, password) {
    const hash = await bcrypt.hash(password.toString(), 10)
    return await User.findOneAndUpdate({ _id: userId }, { password: hash })
}

async function changeUsername(userId, username) {
    return await User.findOneAndUpdate({ _id: userId }, { username: username })
}

async function signUser(email, username, password) {
    try {
        const hash = await bcrypt.hash(password.toString(), 10) // hasing password
        await User.create({ email: email, username: username, password: hash }) // Add voice to db
        return
    } catch (e) {
        if (e.code === 11000) {
            throw new ConflictError('User already exists')
        }
        throw e
    }
}

async function loginUser(email, password) {
    const person = await User.findOne({ email: email })
    if (!person) {
        throw new AuthError('Invalid credentials')
    }
    const match = await bcrypt.compare(password.toString(), person.password)
    if (!match) {
        throw new AuthError('Invalid credentials')
    }
    return jwt.sign({ id: person._id, username: person.username }, process.env.JWT_SECRET, {
        expiresIn: '4h',
    })
}

export { signUser, loginUser, changePassword, changeUsername }
