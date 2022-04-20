'use strict'

const express = require('express')
const cors = require('cors')

const status = require('./controllers/status')
const users =  require('./controllers/users')
const email =  require('./controllers/email')
const verificationCodes = require('./controllers/verificationCodes')
const entries = require('./controllers/entries')
const dictionaries = require('./controllers/dictionaries')

const errors = require('./lib/errors')
const jwt = require('./lib/jwt')


const app = express()

app.use(cors())
app.use(express.json())
// app.use('/users/', auth )


const authCheck = (req, res, next) => {
    if (req.method === "OPTIONS") {
        next()
    }

    try {
        let token = req.headers.authorization.split(' ')[1]
        if (!token) {
            return res.status(401).json({message: "Unauthorized"})
        }

        // throw 'error: jwt malformed' if not valid jwt
        const verified = jwt.verifyAccessToken(token)

        req.user = verified
        next()
    } catch (e) {
        return res.status(401).json({message: "Unauthorized"})
    }
}



app.get('/status/', status.getStatus)

app.post('/users/', users.create)
app.post('/users/login/', users.login)
app.get('/users/check/', authCheck, users.check)

app.get('/users/', authCheck, users.getUsers)
app.delete('/users/:userId/', authCheck, users.deleteOne)
app.get('/users/:userId/friends/', authCheck, users.getFriends)



app.post('/verification-code/', email.sendEmail)

app.post('/users/:userId/verification-codes/', verificationCodes.create)
app.post('/users/:userId/verification-codes/:codeId/', verificationCodes.setAsUsed)


app.post('/users/:userId/dictionaries/:dictionaryId/entries/', entries.createEntry)
app.get('/users/:userId/dictionaries/:dictionaryId/entries/', entries.getEntries)
app.delete('/users/:userId/dictionaries/:dictionaryId/entries/:entryId/', entries.deleteEntry)
app.get('/random/:dictionaryId/', entries.getRandomOne)
// app.get('/users/:userId/dictionaries/:dictionaryId/entries/:entryId', entries.getRandomOne)


app.post('/users/:userId/dictionaries/', dictionaries.createDictionary)
app.get('/users/:userId/dictionaries/', dictionaries.getDictionaries)
app.delete('/users/:userId/dictionaries/:dictionaryId/', dictionaries.deleteDictionary)


// TODO add migrations directory for db
// TODO primary key for email in users table
// TODO saving jwt in db
// TODO one-many users-dictionaries model
// TODO separated log file to tail -f


module.exports = app
