import { User } from '../models/user.model.js'

async function fetchUserInfo(userId) {
    return await User.findById(userId, {
        _id: 1,
        email: 1,
        username: 1,
    }).exec()
}

async function deleteUser(userId) {
    return await User.deleteOne({ _id: userId }).exec()
}

async function fetchAllUsers() {
    return await User.find({}, { username: 1, email: 1 }).exec()
}

export { fetchUserInfo, deleteUser, fetchAllUsers }
