const express = require('express')
const app = express()
const dotenv = require('dotenv').config()
const bcrypt = require('bcrypt')
const mongoose = require('mongoose')
const User = require('./model/user.model')
const port = process.env.NODE_PORT
const url = process.env.MONGODB_URL

app.use(express.json())

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

app.post('/register', async (req, res) => {
    const reqFields = ['email', 'username', 'password', 'confirmPassword']

    const errors = reqFields.reduce((acc, field) => {
        if (!req.body[field]) acc[field] = `Missing ${field}`
        return acc
    }, {})

    if (Object.keys(errors).length != 0) {
        return res.status(400).json({
            error: 'Missing parameters',
            details: errors,
        })
    }

    const { email, username, password, confirmPassword } = req.body

    if (password != confirmPassword) {
        return res.status(400).json('Password mismatch')
    }

    // bcrypt.hash(password.toString(), 10, (err, hash) => {
    //     if (err) throw err
    //     console.log(hash)
    // })

    try {
        const hash = await bcrypt.hash(password.toString(), 10)
        await User.create({ email: email, username: username, password: hash })
        res.json('Welcome')
    } catch (err) {
        console.log(err)
        res.json({ error: 'User already exists' })
    }
})

app.post('/login', async (req, res) => {
    const reqFields = ['email', 'password']

    const errors = reqFields.reduce((acc, field) => {
        if (!req.body[field]) acc[field] = `Missing ${field}`
        return acc
    }, {})

    if (Object.keys(errors).length != 0) {
        res.status(400).json({
            error: 'Missing parameters',
            details: errors,
        })
    }

    const { email, password } = req.body

    try {
        const person = await User.findOne({ email: email })
        const match = await bcrypt.compare(password.toString(), person.password)
        if (!match) {
            return res.status(401).json({ error: 'Passowrd mismatch' })
        }
    } catch (err) {
        console.log(err)
    }

    res.json('Welcome')
})

app.get('/', (req, res) => {
    res.json('Hello World!')
})

startServer()
