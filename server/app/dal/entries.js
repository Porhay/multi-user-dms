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
    await db.entries.create(entry)

    // dictionary counter update
    const dictionaryLength = (await db.entries.findAll({where: {dictionaryId}})).length
    await db.dictionaries.update({count: dictionaryLength}, {where: {id: dictionaryId}})
    return entry
}


exports.getByDictionaryId = async (dictionaryId) => {
    const result = await db.entries.findAll({ where: {dictionaryId} })
    if (!result) {
        return null
    }
    return result
}


exports.deleteAllByDictionaryId = async (dictionaryId) => {
    await db.entries.destroy({ where: {dictionaryId} })
}


exports.deleteById = async (id) => {
    const entry = await db.entries.findByPk(id)
    await db.entries.destroy({ where: {id} })

    // dictionary counter update
    const dictionaryLength = (await db.entries.findAll({where: {dictionaryId: entry.dictionaryId}})).length
    await db.dictionaries.update({count: dictionaryLength}, {where: {id: entry.dictionaryId}})

    return id
}
