import mongoose from 'mongoose'

const ItemSchema = new mongoose.Schema({
    ticket: { type: Number, required: true },
    payload: { type: mongoose.Schema.Types.Mixed, default: {} },
    status: {
        type: String,
        enum: ['waiting', 'serving', 'served'], // Aggiungi enum per sicurezza
        default: 'waiting',
        required: true,
    },
})

const queueSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        ownerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        fieldsDefinition: { type: mongoose.Schema.Types.Mixed },
        items: [ItemSchema], // Plurale
        active: { type: Boolean, default: true }, // Rimosso 'state' inutile
    },
    { timestamps: true },
)

const Queue = mongoose.model('Queue', queueSchema)
export { Queue }
