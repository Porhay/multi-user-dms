const uuid = require('uuid')

const db = require('../db')
const constants = require('../lib/constants')
const hash = require('../lib/hash')


exports.create = async (email, password, name, username, emailVerified = false) => {
    const id = uuid.v4()

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

exports.signIn = () => {

}

exports.getByEmail = async (email) => {
    const result = await db.user.findOne({ where: { email: email.toLowerCase() } })
    if (!result) {
        return null
    }
    return result
}

exports.getByUsername = async (username) => {
    const result = await db.user.findOne({ where: { username: username.toLowerCase() } })
    if (!result) {
        return null
    }
    return result
}

exports.updateUsername = async (userId, username) => {
    await db.user.update({username}, {where: {id: userId}})
}


exports.getByEmailOrUsername = async (emailOrUsername) => {
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

exports.getByName = async (name) => {
    const result = await db.user.findOne({ where: { name } })
    if (!result) {
        return null
    }
    return result
}

exports.updateUserFields = async (userId, fields) => {
    const {name, image} = fields

    const context = {}
    if (name) context.name = name
    if (image) context.image = image

    await db.user.update(context, {where: {id: userId}})
    return await exports.getById(userId)
}

exports.getById = async (id) => {
    const result = await db.user.findByPk(id)
    if (!result) {
        return null
    }
    return result
}

exports.deleteById = async (userId) => {
    return await db.user.destroy({ where: {id: userId} })
}

exports.getAll = async () => {
    return await db.user.findAll()
}

exports.addToFriendsList = async (userId, friendId) => {
    const user = await exports.getById(userId)
    const context = [
        ...user.friends,
        friendId
    ]
    await db.user.update({friends: context}, {where: {id: userId}})
    return context
}


