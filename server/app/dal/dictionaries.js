const db = require("../db")
const dal = require("../dal")
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


exports.getById = async (id) => {
    const result = await db.dictionaries.findByPk(id)
    if (!result) {
        return null
    }
    return result
}


exports.shareDictionary = async (ownerId, recipientId, dictionaryId) => {
    console.log(dictionaryId)
    // var myUuid = Uuid.fromString('ce547c40-acf9-11e6-80f5-76304dec7eb7');

    const dictionary = await exports.getById(dictionaryId)

    console.log(dictionary.name)
    await exports.create(recipientId, dictionary.name)

    const entries = await dal.entries.getByDictionaryId(dictionaryId)
    for(let entry of entries) {
        await dal.entries.create(entry.dictionaryId, entry.key, entry.value)
    }
}


