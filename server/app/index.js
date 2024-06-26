'use strict'

import path from 'path'
import cors from 'cors'
import multer from 'multer'
import express from 'express'
import { v4 as uuidV4 } from 'uuid'
import { fileURLToPath } from 'url'
import * as jwt from './lib/jwt.js'
import * as status from './controllers/status.js'
import * as users from './controllers/users.js'
import * as email from './controllers/email.js'
import * as verificationCodes from './controllers/verificationCodes.js'
import * as entries from './controllers/entries.js'
import * as dictionaries from './controllers/dictionaries.js'
import * as notifications from './controllers/notifications.js'
import * as files from './controllers/files.js'
import { caching } from 'cache-manager';


const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export const app = express()


app.use(express.static(
    process.env.NODE_ENV === 'production' ?
        path.resolve(__dirname, '../data/images') : path.resolve(__dirname, '../dev-deploy/persistent/image-data/')
))
app.use(express.json())
app.use(cors())

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        if (file.fieldname === 'profile-image') {
            cb(null, 'data/images')
        } else if (file.fieldname === 'text-file') {
            cb(null, 'data/imported')
        } else {
            cb(null, 'data/images')
        }
    },
    filename: (req, file, cb) => {
        if (file.mimetype === 'text/plain') {
            const caption = `${uuidV4()}.${file.originalname}`
            cb(null, caption)
        } else {
            const caption = `${uuidV4()}.${file.mimetype.split('/')[1]}`
            cb(null, caption)
        }
    }
})
const upload = multer({ storage })


const authCheck = (req, res, next) => {
    if (req.method === 'OPTIONS') {
        next()
    }

    try {
        let token = req.headers.authorization.split(' ')[1]
        if (!token) {
            return res.status(401).json({ message: 'Unauthorized' })
        }

        // throw 'error: jwt malformed' if not valid jwt
        const verifiedData = jwt.verifyAccessToken(token)
        if (verifiedData) {
            req.user = verifiedData
        }
        next()
    } catch (e) {
        return res.status(401).json({ message: 'Unauthorized' })
    }
}


const memoryCache = await caching('memory', {
    max: 100,
    ttl: 10 * 1000
});


const cacheMiddleware = async (req, res, next) => {
    // Only cache GET requests
    if (req.method !== 'GET') {
        return next();
    }

    const cacheKey = `${req.originalUrl}`;

    try {
        const cachedResponse = await memoryCache.get(cacheKey);
        if (cachedResponse) {
            console.log('Cache hit:', cacheKey);
            return res.send(cachedResponse);
        } else {
            console.log('Cache miss:', cacheKey);
        }
    } catch (error) {
        console.error('Cache error:', error);
        return next(error);
    }

    // Wrap `res.send` to cache the response
    const originalSend = res.send.bind(res);
    res.send = (body) => {
        memoryCache.set(cacheKey, body).then(() => {
            console.log('Response cached:', cacheKey);
        }).catch((error) => {
            console.error('Error caching response:', cacheKey, error);
        });
        return originalSend(body);
    };

    next();
};


app.get('/status/', status.getStatus)

app.use('/users/:userId/', authCheck)
app.get('/check/', authCheck, users.check)

// Apply the cache middleware to all GET routes
app.use(cacheMiddleware)

app.post('/login/', users.login)
app.post('/users/', users.create)

app.get('/users/', users.getUsers)
app.delete('/users/:userId/', users.deleteOne)
app.get('/users/:userId/', users.getUser)


app.post('/users/:userId/friends/', users.addFriends)
app.get('/users/:userId/friends/', users.getFriends)

app.post('/users/:userId/update-profile/', users.updateProfile)
app.post('/users/:userId/username/', users.updateUsername)

app.post('/verification-code/', email.sendEmail)

app.post('/users/:userId/verification-codes/', verificationCodes.create)
app.post('/users/:userId/verification-codes/:codeId/', verificationCodes.setAsUsed)

app.post('/users/:userId/dictionaries/:dictionaryId/entries/', entries.createEntry)
app.post('/users/:userId/dictionaries/:dictionaryId/entries/:entryId/', entries.updateEntry)
app.get('/users/:userId/dictionaries/:dictionaryId/entries/', entries.getEntries)
app.delete('/users/:userId/dictionaries/:dictionaryId/entries/:entryId/', entries.deleteEntry)


app.post('/users/:userId/share-dictionary/', dictionaries.shareDictionary)
app.post('/users/:userId/dictionaries/', dictionaries.createDictionary)
app.post('/users/:userId/dictionaries/:dictionaryId/', dictionaries.updateDictionary)
app.get('/users/:userId/dictionaries/', dictionaries.getDictionaries)
app.get('/users/:userId/dictionaries/:dictionaryId/', dictionaries.getDictionary)
app.delete('/users/:userId/dictionaries/:dictionaryId/', dictionaries.deleteDictionary)

app.post('/users/:userId/files/', upload.single('file'), files.fileUpload)
app.get('/users/:userId/files/:fileId/', files.getSignedUrl)

app.post('/users/:userId/import-dictionary/', upload.single('text-file'), dictionaries.importDictionary)
app.post('/users/:userId/upload-profile-image/', upload.single('file'), users.uploadProfileImage)

app.post('/notifications/', notifications.newNotification)
app.get('/notifications/', notifications.getNotifications)
app.get('/users/:userId/notifications/', notifications.getStoredNotifications)
app.delete('/users/:userId/notifications/:notificationId/', notifications.deleteStoredNotification)


// TODO: add migrations directory for db
// TODO: primary key for email in users table
// TODO: saving jwt in db
// TODO: separated log file to tail -f
// TODO: dictionary info(time created, time shared, length...)
// TODO: garbage collector for old notifications in db
// TODO: delete avatar on set new avatar or in garbage collector
