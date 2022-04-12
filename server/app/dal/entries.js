const db = require("../db")
const uuid = require('uuid')


exports.create = async (dictionaryId, key, value) => {
    const id = uuid.v4()
    const entry = {
        id,
        dictionaryId,
        key,
        value,
    }
    await db.entries.create(entry) // entries
    return entry
}


exports.getByDictionaryId = async (dictionaryId) => {
    const result = await db.entries.findAll({ where: { dictionaryId } })
    if (!result) {
        return null
    }
    return result
}
