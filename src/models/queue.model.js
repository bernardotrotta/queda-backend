import mongoose from 'mongoose'

/**
 * Schema definition for an Item in a Queue.
 * Represents a user's position and status within a specific queue.
 */
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
            required: true,
        },
        ticket: { type: Number, required: true },
        payload: { type: mongoose.Schema.Types.Mixed, default: {} },
        status: {
            type: String,
            enum: ['waiting', 'serving', 'served', 'quit'],
            default: 'waiting',
            required: true,
        },
        startedServingAt: {
            type: Date,
        },
        servedAt: {
            type: Date,
        },
        quitAt: {
            type: Date,
        },
    },
    { timestamps: true },
)

ItemSchema.index({ queueId: 1, userId: 1 }, { unique: false })

/**
 * Schema definition for a Queue.
 * Represents a managed queue owned by a user.
 */
const QueueSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        ownerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        active: { type: Boolean, default: true },
        averageServingTime: {
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

/**
 * Mongoose model for the Queue entity.
 */
const Queue = mongoose.model('Queue', QueueSchema)

/**
 * Mongoose model for the Item entity.
 */
const Item = mongoose.model('Item', ItemSchema)

export { Queue, Item }
