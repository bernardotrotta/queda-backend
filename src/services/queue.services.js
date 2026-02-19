import { Queue } from '../models/queue.model.js'

async function enqueue(users) {
    try {
        await Queue.create(users)
    } catch (e) {
        throw e
    }
}

async function createQueue(user) {
    return await Queue.create({
        ownerId: user,
        name: 'Cardiologia - Stanza 1',
        active: true,
        fieldsDefinition: {
            codice_priorita: {
                type: 'enum',
                options: ['rosso', 'giallo', 'verde'],
            },
            sintomi: { type: 'text' },
        },
        items: [],
    })
}

async function dequeue() {
    return await Queue.findOne().sort({ createdAt: 1 })
}

async function showQueue() {
    return await Queue.find()
}

export { enqueue, dequeue, showQueue, createQueue }
