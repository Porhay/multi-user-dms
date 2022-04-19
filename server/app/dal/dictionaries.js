const db = require("../db")
const uuid = require('uuid')


exports.create = async (userId, name) => {
    const id = uuid.v4()
    const dictionary = {
        id,
        userId,
        name,
    }
    await db.dictionaries.create(dictionary)
    return dictionary
}


exports.getByUserId = async (userId) => {
    const result = await db.dictionaries.findAll({ where: { userId } })
    if (!result) {
        return null
    }
    return result
}


exports.deleteById = async (dictionaryId) => {
    return await db.dictionaries.destroy({ where: {id: dictionaryId} })
}
