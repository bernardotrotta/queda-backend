import mongoose from 'mongoose'

/**
 * Schema definition for a User.
 * Stores account information for both queue owners and participants.
 */
const userSchema = new mongoose.Schema({
    email: { type: String, unique: true, required: true },
    username: String,
    password: String,
})

/**
 * Mongoose model for the User entity.
 */
const User = mongoose.model('User', userSchema)

export { User }
