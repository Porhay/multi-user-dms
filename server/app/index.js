'use strict'

const express = require('express')
const cors = require("cors")

const status = require('./controllers/status')
const users =  require('./controllers/users')
const email =  require('./controllers/email')


const app = express()

app.use(cors())
app.use(express.json())


app.get('/status/', status.getStatus)

app.post('/users/', users.registration)

app.get('/internal/users/', users.getUsers)
app.delete('/internal/users/:userId/', users.deleteOne)

app.post('/verification-code/', email.sendEmail)

// TODO add migrations directory for db
// TODO primary cay for email in user table
// TODO verification codes inserting
// TODO


module.exports = app
