'use strict'

import * as db from '../db.js'
import { v4 as uuidV4 } from 'uuid'


export const create = async (dictionaryId, key, value) => {
    const id = uuidV4()
    const entry = {
        id,
        dictionaryId,
        key,
        value,
    }
    await db.entries.create(entry)

    // dictionary counter update
    const dictionaryLength = (await db.entries.findAll({ where: { dictionaryId } })).length
    await db.dictionaries.update({ count: dictionaryLength }, { where: { id: dictionaryId } })
    return entry
}

export const getById = async (id) => {
    const result = await db.entries.findByPk(id)
    if (!result) {
        return null
    }
    return result
}


export const getByDictionaryId = async (dictionaryId) => {
    const result = await db.entries.findAll({ where: { dictionaryId } })
    if (!result) {
        return null
    }
    return result
}


export const deleteAllByDictionaryId = async (dictionaryId) => {
    await db.entries.destroy({ where: { dictionaryId } })
}


export const deleteById = async (id) => {
    const entry = await db.entries.findByPk(id)
    await db.entries.destroy({ where: { id } })

    // dictionary counter update
    const dictionaryLength = (await db.entries.findAll({ where: { dictionaryId: entry.dictionaryId } })).length
    await db.dictionaries.update({ count: dictionaryLength }, { where: { id: entry.dictionaryId } })

    return id
}

export const update = async (id, data) => {
    await db.entries.update(data, { where: { id } })
    return await getById(id)
}
