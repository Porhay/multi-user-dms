'use strict'

const express = require('express')
const cors = require("cors")

const status = require('./controllers/status')
const user =  require('./controllers/user')


const app = express()

app.use(cors())
app.use(express.json())


app.get('/status/', status.getStatus)

app.post('/users/', user.registration)

app.get('/internal/users/', user.getUsers)
app.delete('/internal/users/:userId/', user.deleteOne)



module.exports = app
