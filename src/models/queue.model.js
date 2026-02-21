import mongoose from 'mongoose'

const ItemSchema = new mongoose.Schema(
    {
        queueId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Queue',
            required: true,
        },
        ticket: { type: Number, required: true },
        payload: { type: mongoose.Schema.Types.Mixed, default: {} },
        status: {
            type: String,
            enum: ['waiting', 'serving', 'served'],
            default: 'waiting',
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
        /* fieldsDefinition: { type: mongoose.Schema.Types.Mixed }, */
        active: { type: Boolean, default: true },
    },
    { timestamps: true },
)

const Queue = mongoose.model('Queue', QueueSchema)
const Item = mongoose.model('Item', ItemSchema)
export { Queue, Item }
