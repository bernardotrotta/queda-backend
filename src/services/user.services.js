import { User } from '../models/user.model.js'

/**
 * Fetches basic information for a specific user.
 * 
 * @param {string} userId - The unique identifier of the user.
 * @returns {Promise<Object>} The user document with basic info (id, email, username).
 */
async function fetchUserInfo(userId) {
    return await User.findById(userId, {
        _id: 1,
        email: 1,
        username: 1,
    }).exec()
}

/**
 * Deletes a user account from the system.
 * 
 * @param {string} userId - The unique identifier of the user to delete.
 * @returns {Promise<Object>} Object containing the result of the deletion operation.
 */
async function deleteUser(userId) {
    return await User.deleteOne({ _id: userId }).exec()
}

/**
 * Fetches all users in the system.
 * 
 * @returns {Promise<Array>} An array of all user documents (username and email only).
 */
async function fetchAllUsers() {
    return await User.find({}, { username: 1, email: 1 }).exec()
}

export { fetchUserInfo, deleteUser, fetchAllUsers }
