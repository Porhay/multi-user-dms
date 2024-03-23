'use strict'

import path from 'path'
import * as dal from '../dal/index.js'
import * as jwt from '../lib/jwt.js'
import errors from '../errors.js'
import * as hash from '../lib/hash.js'
import * as helpers from '../lib/helpers.js'
import * as files from '../lib/files.js'


export const create = async (req, res) => {
    try {
        const { email, password } = req.body

        if (!email) {
            throw new errors.BadRequest('Email is required!')
        }
        if (!password) {
            throw new errors.BadRequest('Password is required!')
        }

        // check for existence
        const candidate = await dal.users.getByEmail(email)
        if (candidate) {
            throw new errors.BadRequest('User with the same email is already exists!')
        }

        const name = await helpers.createUniqueRandomName()
        const username = await helpers.createUniqueRandomName()
        const user = await dal.users.create(email, password, name, username)

        // default user's dictionary with entries
        const dictionary = await dal.dictionaries.create(user.id, 'Get Started')
        // await dal.entries.create(dictionary.id, 'some word', 'some translation')

        // TODO: remove when admin user lofic will be ready
        const filePath = path.resolve('data/imported', 'ewords.txt')
        const entries = await files.getDataFromImportedFile(filePath)
        if (entries) {
            for (const entry of entries) {
                await dal.entries.create(dictionary.id, entry[0], entry[1])
            }
        }

        const token = jwt.generateAccessToken(user.id, user.role)
        res.json({ token, user: { id: user.id, username: user.username, email: user.email } })
    } catch (error) {
        errors.handleErrors(res, error)
    }
}


export const login = async (req, res) => {
    try {
        const { email, password } = req.body

        if (!email) {
            throw new errors.BadRequest('Email isn\'t provided')
        }
        if (!password) {
            throw new errors.BadRequest('Password isn\'t provided')
        }

        const user = await dal.users.getByEmail(email)
        if (!user || !(await hash.comparePasswords(password, user.password))) {
            throw new errors.NotFound('User does not exist or wrong password')
        }

        const token = jwt.generateAccessToken(user.id, user.role)
        res.json({ token, user: { id: user.id, username: user.username, email: user.email } })
    } catch (error) {
        errors.handleErrors(res, error)
    }
}

export const check = async (req, res) => {
    const token = jwt.generateAccessToken(req.user.id, req.user.role)
    const user = await dal.users.getById(req.user.id)
    user.password = null
    return res.json({ token, user })
}


export const getUsers = async (req, res) => {
    const users = await dal.users.getAll()
    res.json(users)
}

export const getUser = async (req, res) => {
    try {
        const userId = req.params.userId // or username

        let user = await dal.users.getByUsername(userId)
        if (!user) {
            user = await dal.users.getById(userId)
        }

        if (user) {
            user.password = null
            res.json(user)
        } else {
            res.json(null)
        }
    } catch (error) {
        console.error('Error:', error.message)
        res.status(500).json({ error: 'Internal Server Error' })
    }
}


export const updateUsername = async (req, res) => {
    const userId = req.params.userId
    const username = req.body.username
    await dal.users.updateUsername(userId, username).catch(err => {
        return console.log(err)
    })
    return res.json('OK')
}


export const deleteOne = async (req, res) => {
    const userId = req.params.userId
    await dal.users.deleteById(userId)
    res.json({ message: 'OK' })
}

export const updateProfile = async (req, res) => {
    const userId = req.params.userId

    /**
     * fields: {name, city, theme...}
     */
    const fields = req.body.fields
    await dal.users.updateUserFields(userId, fields)
    res.json({ message: 'OK' })
}

export const addFriends = async (req, res) => {
    const userId = req.params.userId
    const friendId = req.body.friendId

    const user = await dal.users.getById(userId)
    for (const userId of user.friends) {
        if (userId === friendId) {
            return res.status(500).send('User already has this id in friend list')
        }
    }

    // add user to the friend's friend list too
    await dal.users.addToFriendsList(friendId, userId)

    const response = await dal.users.addToFriendsList(userId, friendId)
    res.json(response)
}

export const getFriends = async (req, res) => {
    const userId = req.params.userId
    const user = await dal.users.getById(userId)

    let friends = []
    for (const userId of user.friends) {
        const friend = await dal.users.getById(userId)
        friends.push({ id: userId, name: friend.name })
    }

    res.json(friends)
}


export const uploadProfileImage = async (req, res) => {
    const userId = req.params.userId
    // TODO merge with updateProfile
    try {
        const user = await dal.users.updateUserFields(userId, { image: req.file.filename })
        console.log(`db.users.image updated, filename: ${req.file.filename}`)
        res.json({ image: user.image })
    } catch (err) {
        console.log(err)
    }
}

