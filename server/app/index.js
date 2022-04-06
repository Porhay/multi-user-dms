'use strict'

const express = require('express')
const cors = require("cors")

const status = require('./controllers/status')
const users =  require('./controllers/users')
const email =  require('./controllers/email')
const verificationCodes = require('./controllers/verificationCodes')


const app = express()

app.use(cors())
app.use(express.json())


app.get('/status/', status.getStatus)

app.post('/users/', users.create)
app.post('/users/sign-in/', users.signIn)

app.get('/users/', users.getUsers)
app.delete('/users/:userId/', users.deleteOne)

app.post('/verification-code/', email.sendEmail)

app.post('/users/:userId/verification-codes/', verificationCodes.create)
app.post('/users/:userId/verification-codes/:codeId/', verificationCodes.setAsUsed)


// TODO add migrations directory for db
// TODO primary key for email in users table
// TODO saving jwt in db
// TODO one-many users-dictionaries model
// TODO


module.exports = app
