const db = require('../db')
const uuid = require('uuid')

const hash = require('../lib/hash')


exports.create = async (email, password, emailVerified) => {
    const candidate = await exports.getByEmail(email)
    if(candidate){
        throw new Error('User with the same email is already exists!')
    }

    const id = uuid.v4()

    if (!emailVerified) {
        emailVerified = false
    }

    let hashedPassword
    if (password) {
        hashedPassword = await hash.hashPassword(password)
    }

    const user = {
        id,
        email,
        emailVerified,
        password: hashedPassword
    }
    await db.user.create(user)
    return user
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
    if (!result.length) {
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
