import bcrypt from 'bcrypt'
import { User } from '../models/user.model.js'
import { ConflictError, AuthError } from '../errors/errors.js'
import jwt from 'jsonwebtoken'

process.loadEnvFile()

/**
 * Changes a user's password.
 *
 * @param {string} userId - The unique identifier of the user.
 * @param {string} password - The new plain-text password.
 * @returns {Promise<Object>} The updated user document.
 */
async function changePassword(userId, password) {
    const hash = await bcrypt.hash(password.toString(), 10)
    return await User.findOneAndUpdate({ _id: userId }, { password: hash })
}

/**
 * Changes a user's username.
 *
 * @param {string} userId - The unique identifier of the user.
 * @param {string} username - The new username.
 * @returns {Promise<Object>} The updated user document.
 */
async function changeUsername(userId, username) {
    return await User.findOneAndUpdate({ _id: userId }, { username: username })
}

/**
 * Registers a new user in the system.
 *
 * @param {string} email - The user's email address.
 * @param {string} username - The user's chosen username.
 * @param {string} password - The user's plain-text password.
 * @throws {ConflictError} If the user already exists (duplicate email/username).
 * @returns {Promise<void>}
 */
async function signUser(email, username, password) {
    try {
        const hash = await bcrypt.hash(password.toString(), 10)
        await User.create({ email: email, username: username, password: hash })
        return
    } catch (e) {
        if (e.code === 11000) {
            throw new ConflictError('User already exists')
        }
        throw e
    }
}

/**
 * Authenticates a user and generates a JWT token.
 *
 * @param {string} email - The user's email address.
 * @param {string} password - The user's plain-text password.
 * @throws {AuthError} If credentials are invalid.
 * @returns {Promise<string>} A signed JWT token.
 */
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
