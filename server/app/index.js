'use strict'

const express = require('express')
const cors = require("cors")

const status = require('./controllers/status')


const app = express()

app.use(cors())
app.use(express.json())


//= API Requests
app.get('/api/status/', status.getStatus)


module.exports = app
