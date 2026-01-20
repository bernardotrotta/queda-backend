const express = require('express')
const app = express()
const port = 3000
const MongoClient = require('mongodb').MongoClient
const url = 'mongodb://127.0.0.1:27017/'
const bcrypt = require('bcrypt')

app.use(express.json());

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

app.post('/register', (req, res) => {
  const reqFields = ['email', 'username', 'password', 'confirmPassword']

  /* What should I answer to the server */

  reqFields.forEach(field => {
    if (!req.body[field]) {
      console.log(`${field} not found`)
      return
    }
  });

  if (req.body[reqFields[3]] != req.body[reqFields[4]]) {
    res.send("Password mismatch")
    return
  }

  bcrypt.hash(req.body.password.toString(), 10, (err, hash) => {
    if (err) throw err
    console.log(hash)
  })

  console.log(req.body)
  res.send("Welcome")

})

app.post('/login', (req, res) => {
  if (!req.body.email) {
    console.log('Email not found')
  }
  if (!req.body.password) {
    console.log('Password not found')
  }
  console.log(req.body.email)
  console.log(req.body.password)


  bcrypt.compare("req.body.password.toString()", hash, (err, result) => {
    if (err) throw err
    if (!result) {
      console.log("Password mismatch")
      return
    }
    console.log("Welcome bro")
  })

  res.send('Welcome')
})

app.get('/', (req, res) => {
  res.send('Hello World!')
})

MongoClient.connect(url, (err, db) => {
  if (err) throw err
  db.collection('quedo').find().toArray((err, result) => {
    if (err) throw err
    console.log(result)
  })
  db.close()
})

function checkPassword(pwd, pwdConfirm) {
  if (pwd === pwdConfirm) {
    console.log("Ok")
  }
}

