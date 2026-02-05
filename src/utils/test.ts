// import { User } from "./user.mts"
// import { Queue } from "./queue.mts"

// const q1 = new Queue()
// const u1: User = {id : 1, name:  "Bernardo"}
// q1.enqueue(u1)

// q1.print()

// getting-started.js
const mongoose = require('mongoose')

main().catch((err) => console.log(err))

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/quedo')
    const userSchema = new mongoose.Schema({ username: String })
    const User = mongoose.model('User', userSchema)
    const bernardo = new User({ username: 'Bernardo' })
    console.log(bernardo.username)
    await bernardo.save()
    const kittens = await User.find()
    console.log(kittens)
}
