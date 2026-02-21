import bcrypt from 'bcrypt'
import { User } from '../models/user.model.js'
import jwt from 'jsonwebtoken'
import { ValidationError, ConflictError, AuthError } from '../errors/index.js'

process.loadEnvFile()

async function signUser(data) {
    const REQ_FIELDS = ['email', 'username', 'password', 'confirmPassword']

    const errors = REQ_FIELDS.reduce((missingFields, field) => {
        if (!data[field]) missingFields[field] = `Missing ${field}`
        return missingFields
    }, {})

    if (Object.keys(errors).length != 0) {
        throw new ValidationError('Missing parameters', errors)
    }

    const { email, username, password, confirmPassword } = data

    if (password != confirmPassword) {
        throw new ValidationError('Password mismatch')
    }
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

async function loginUser(data) {
    const reqFields = ['email', 'password']

    const errors = reqFields.reduce((acc, field) => {
        if (!data[field]) acc[field] = `Missing ${field}`
        return acc
    }, {})

    if (Object.keys(errors).length != 0) {
        throw new ValidationError('Missing parameters', errors)
    }

    const { email, password } = data

    const person = await User.findOne({ email: email })
    if (!person) {
        throw new AuthError('Invalid credentials')
    }
    const match = await bcrypt.compare(password.toString(), person.password)
    if (!match) {
        throw new AuthError('Invalid credentials')
    }
    const token = jwt.sign(
        { id: person._id, username: person.username },
        process.env.JWT_SECRET,
        {
            expiresIn: '1h',
        },
    )
    return token
}

export { signUser, loginUser }
