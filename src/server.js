import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import { Server } from 'socket.io'
import { createServer } from 'node:http'
import jwt from 'jsonwebtoken'
import authRouter from './routes/auth.route.js'
import queuesRouter from './routes/queue.route.js'
import userRouter from './routes/user.route.js'
import { errorHandler } from './middlewares/error.middleware.js'

const app = express()
const port = process.env.NODE_PORT
const server = createServer(app)
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@queda.b6rphk9.mongodb.net/queda?appName=Queda/queda`
const io = new Server(server)

process.loadEnvFile()

async function startServer() {
    try {
        await mongoose.connect(uri)
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

app.use(cors())
app.use(express.json())
app.use('/auth', authRouter)
app.use('/queues', queuesRouter)
app.use('/users', userRouter)
app.use(errorHandler)
app.get('/protected', (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1]
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        res.send(decoded)
    } catch (e) {
        next(e)
    }
})

startServer()
