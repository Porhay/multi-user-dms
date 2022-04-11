const db = require("../db")
const uuid = require('uuid')


exports.create = async (dictionaryId, key, value) => {
    const id = uuid.v4()
    const card = {
        id,
        dictionaryId,
        key,
        value,
    }
    await db.instances.create(card) // cards
    return card
}


exports.getByDictionaryId = async (dictionaryId) => {
    const result = await db.instances.findAll({ where: { dictionaryId } })
    if (!result) {
        return null
    }
    return result
}
