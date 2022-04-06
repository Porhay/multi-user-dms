const uuid = require('uuid')

const db = require('../db')
const constants = require('../lib/constants')
const hash = require('../lib/hash')


exports.create = async (email, password, emailVerified = false) => {
    const id = uuid.v4()

    let hashedPassword
    if (password) {
        hashedPassword = await hash.hashPassword(password)
    }

    const user = {
        id,
        email: email.toLowerCase(),
        emailVerified,
        password: hashedPassword,
        role: constants.USER_ROLES.USER
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
