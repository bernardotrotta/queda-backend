import mongoose from 'mongoose'

const ItemSchema = new mongoose.Schema(
    {
        queueId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Queue',
            required: true,
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        ticket: { type: Number, required: true },
        payload: { type: mongoose.Schema.Types.Mixed, default: {} },
        status: {
            type: String,
            enum: ['waiting', 'serving', 'served'],
            default: 'waiting',
            required: true,
        },
        startedServingAt: {
            type: Date,
        },
        servedAt: {
            type: Date,
        },
        servingTimeEstimation: {
            type: Number,
            required: true,
        },
    },
    { timestamps: true },
)

const QueueSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        ownerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        active: { type: Boolean, default: true },
        defaultServingTimeEstimation: {
            type: Number,
            required: true,
        },
        counter: {
            type: Number,
            default: 0,
        },
    },
    { timestamps: true },
)

const Queue = mongoose.model('Queue', QueueSchema)
const Item = mongoose.model('Item', ItemSchema)
export { Queue, Item }
