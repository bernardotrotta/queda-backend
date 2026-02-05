import express from 'express'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import { signUser, loginUser } from './services/auth.services.js'
import { Server } from 'socket.io'
import { createServer } from 'node:http'
import { enqueue, dequeue, showQueue } from './services/queue.services.js'

dotenv.config()

const app = express()
const port = process.env.NODE_PORT
const server = createServer(app)
const url = process.env.MONGODB_URL
const io = new Server(server)

async function startServer() {
    try {
        await mongoose.connect(url)
        console.log('Connected to database')

        server.listen(port, () => {
            console.log(`Example app listening on port ${port}`)
        })
    } catch (err) {
        console.error('Failed to start server:', err)
        process.exit(1)
    }
}

io.on('connection', (socket) => {
    console.log('a user connected')
    socket.on('disconnect', () => {
        console.log('user disconnected')
    })
    socket.on('message', (msg) => {
        console.log('message: ' + msg)
        io.emit('message', msg)
    })
})

app.use(express.json())

app.post('/signup', async (req, res, next) => {
    try {
        await signUser(req.body)
        res.json({ message: 'Account created' })
    } catch (e) {
        next(e)
    }
})

app.get('/test', async (req, res, next) => {
    try {
        // const users = [{ username: 'Beranrdo' }, { username: 'Vittorio' }]
        // await enqueue(users)
        const item = await dequeue()
        res.json({ message: 'success', queue: item })
    } catch (e) {
        next(e)
    }
})

app.post('/login', async (req, res, next) => {
    try {
        const token = await loginUser(req.body)
        res.json({ token })
    } catch (e) {
        next(e)
    }
})

app.post('/queue/users/enqueue', async (req, res, next) => {
    try {
        const data = req.body
        await enqueue(data)
        res.json({ message: 'success' })
    } catch (e) {
        next(e)
    }
})

app.get('/', (req, res) => {
    res.json('Hello World!')
})

app.get('/protected', (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1]
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        res.send(decoded)
    } catch (e) {
        res.status(401).json({ error: 'Unauthorized' })
    }
})

app.use((err, req, res, next) => {
    res.status(err.status || 500).json({
        error: err.message,
        details: err.details,
    })
})

startServer()
