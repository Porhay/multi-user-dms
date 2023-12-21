'use strict'

import {v4 as uuidV4} from 'uuid'
import * as db from '../db.js'
import * as constants from '../lib/constants.js'
import * as hash from '../lib/hash.js'


export const create = async (email, password, name, username, emailVerified = false) => {
    const id = uuidV4()

    let hashedPassword
    if (password) {
        hashedPassword = await hash.hashPassword(password)
    }

    const user = {
        id,
        email: email.toLowerCase(),
        emailVerified,
        username,
        password: hashedPassword,
        role: constants.USER_ROLES.USER,
        name
    }
    await db.user.create(user)
    return user
}

export const signIn = () => {

}

export const getByEmail = async (email) => {
    const result = await db.user.findOne({ where: { email: email.toLowerCase() } })
    if (!result) {
        return null
    }
    return result
}

export const getByUsername = async (username) => {
    const result = await db.user.findOne({ where: { username: username.toLowerCase() } })
    if (!result) {
        return null
    }
    return result
}

export const updateUsername = async (userId, username) => {
    await db.user.update({username}, {where: {id: userId}})
}


export const getByEmailOrUsername = async (emailOrUsername) => {
    const result = await db.user.findAll({
        where: {
            email: emailOrUsername.toLowerCase(),
            username: emailOrUsername.toLowerCase(),
        }
    })
    if (!result[0]) {
        return null
    }
    return result[0]
}

export const getByName = async (name) => {
    const result = await db.user.findOne({ where: { name } })
    if (!result) {
        return null
    }
    return result
}

export const updateUserFields = async (userId, fields) => {
    const {name, image} = fields

    const context = {}
    if (name) context.name = name
    if (image) context.image = image

    await db.user.update(context, {where: {id: userId}})
    return await getById(userId)
}

export const getById = async (id) => {
    const result = await db.user.findByPk(id)
    if (!result) {
        return null
    }
    return result
}

export const deleteById = async (userId) => {
    return await db.user.destroy({ where: {id: userId} })
}

export const getAll = async () => {
    return await db.user.findAll()
}

export const addToFriendsList = async (userId, friendId) => {
    const user = await getById(userId)
    const context = [
        ...user.friends,
        friendId
    ]
    await db.user.update({friends: context}, {where: {id: userId}})
    return context
}


