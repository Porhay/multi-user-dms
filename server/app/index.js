'use strict'

const express = require('express')
const cors = require("cors")

const status = require('./controllers/status')
const user =  require('./controllers/user')


const app = express()

app.use(cors())
app.use(express.json())


//= API Requests
app.get('/api/status/', status.getStatus)

app.post('/api/registration', user.registration)


module.exports = app
