import { Temporal } from '@js-temporal/polyfill'

const numbers = [1, -1, 2, 4]
console.log(numbers)
console.log(typeof numbers)

const reqFields = ['email', 'username', 'password', 'confirmPassword']

const sum = numbers.reduce((accumulator, currentValue) => {
    return accumulator + currentValue
})

// for (const field of reqFields) {
//     if (!req.body[field]) {
//         console.log(`${field} not found`)
//         res.status(400).send('Missing parameters')
//         return
//     }
// }

console.log(sum)

const req = {
    body: {
        email: 'bernardotrotta@outlook.it',
        username: 'Bernardo',
        password: 1234,
    },
}

const test = reqFields.reduce((accumulator, field) => {
    if (!req.body[field]) accumulator.push(field)
    return accumulator
}, [])

console.log(test)

const duration = Temporal.PlainDate.from('2026-03-10')
console.log(duration)

/*

			"startedServingAt": "2026-02-23T20:23:33.351Z",
			"servedAt": "2026-02-23T20:23:53.192Z",

*/

const time = new Date('2026-02-23T20:23:33.351Z')
console.log(time)
const time2 = new Date('2026-02-23T20:23:53.192Z')
console.log(time2)

const difference = time2 - time
console.log(difference)
