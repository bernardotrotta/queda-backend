import express from 'express'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import { signUser, loginUser } from './services/auth.services.js'
import { Server } from 'socket.io'

dotenv.config()

const app = express()
const port = process.env.NODE_PORT
const url = process.env.MONGODB_URL
const io = new Server()

async function startServer() {
    try {
        await mongoose.connect(url)
        console.log('Connected to database')

        app.listen(port, () => {
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

app.post('/login', async (req, res, next) => {
    try {
        const token = await loginUser(req.body)
        res.json({ token })
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
