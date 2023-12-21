'use strict'

import * as db from '../db.js'
import {v4 as uuidV4} from 'uuid'


export const create = async (userId, name) => {
    const id = uuidV4()
    const dictionary = {
        id,
        userId,
        name,
    }
    await db.dictionaries.create(dictionary)
    return dictionary
}


export const getByUserId = async (userId) => {
    const result = await db.dictionaries.findAll({ where: { userId } })
    if (!result) {
        return null
    }
    return result
}

export const deleteById = async (dictionaryId) => {
    return await db.dictionaries.destroy({ where: {id: dictionaryId} })
}

export const getById = async (id) => {
    const result = await db.dictionaries.findByPk(id)
    if (!result) {
        return null
    }
    return result
}

export const copyDictionary = async (userToCopy, dictionaryId) => {
    const dictionary = await getById(dictionaryId)
    return await create(userToCopy, dictionary.name)
}

export const update = async (id, fields) => {
    return await db.dictionaries.update(fields, {where: {id}})
}


