import mongoose from 'mongoose'
const queueModel = mongoose.Schema(
    {
        users: [],
    },
    { timestamps: true },
)
const Queue = mongoose.model('Queue', queueModel)
export { Queue }
