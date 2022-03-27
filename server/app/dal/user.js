const db = require('../db')


exports.create = async (email, password) => {
    return await db.user.create({email, password})
}

exports.getByEmail = async (email) => {
    const result = await db.user.findByPk(email.toLowerCase())
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
