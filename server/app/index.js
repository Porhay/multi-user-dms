'use strict'

const express = require('express')
const cors = require('cors')
const jwt = require('./lib/jwt')
const multer = require('multer')
const path = require('path')
const uuid = require('uuid')

const status = require('./controllers/status')
const users =  require('./controllers/users')
const email =  require('./controllers/email')
const verificationCodes = require('./controllers/verificationCodes')
const entries = require('./controllers/entries')
const dictionaries = require('./controllers/dictionaries')
const notifications = require('./controllers/notifications')


const app = express()

app.use(express.static(path.resolve(__dirname, '../dev-deploy/persistent/image-data/')))
app.use(express.json())
app.use(cors())


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
        const verifiedData = jwt.verifyAccessToken(token)
        if(verifiedData) {
            req.user = verifiedData
        }
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
app.get('/users/:userId/', users.getUser)

app.get('/users/:userId/friends/', authCheck, users.getFriends)

app.post('/users/:userId/update-profile/', authCheck, users.updateProfile)


app.post('/verification-code/', email.sendEmail)

app.post('/users/:userId/verification-codes/', verificationCodes.create)
app.post('/users/:userId/verification-codes/:codeId/', verificationCodes.setAsUsed)


app.post('/users/:userId/dictionaries/:dictionaryId/entries/', entries.createEntry)
app.get('/users/:userId/dictionaries/:dictionaryId/entries/', entries.getEntries)
app.delete('/users/:userId/dictionaries/:dictionaryId/entries/:entryId/', entries.deleteEntry)
app.get('/random/:dictionaryId/', entries.getRandomOne)
// app.get('/users/:userId/dictionaries/:dictionaryId/entries/:entryId', entries.getRandomOne)

app.post('/users/:userId/share-dictionary/', dictionaries.shareDictionary)



app.post('/users/:userId/dictionaries/', dictionaries.createOrUpdateDictionary)
app.get('/users/:userId/dictionaries/', dictionaries.getDictionaries)
app.delete('/users/:userId/dictionaries/:dictionaryId/', dictionaries.deleteDictionary)

app.post('/notifications/', notifications.newNotification)
app.get('/notifications/', notifications.getNotifications)


// TODO take outside
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "dev-deploy/persistent/image-data")
    },
    filename: (req, file, cb) => {
        const caption = `${uuid.v4()}.${file.mimetype.split('/')[1]}`
        cb(null, caption)
    },
})

const upload = multer({ storage })

app.post("/users/:userId/upload-profile-image/", upload.single("file"), users.uploadProfileImage)



// TODO add migrations directory for db
// TODO primary key for email in users table
// TODO saving jwt in db
// TODO separated log file to tail -f
// TODO set up the linter
// TODO dictionary info(time created, time shared, length...)
// TODO standard list

module.exports = app
