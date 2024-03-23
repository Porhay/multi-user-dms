'use strict'

import {v4 as uuidV4} from 'uuid'
import * as db from '../db.js'

/**
 * Create file in database
 * @param {userId, filename, size, mime} data
 * @returns
 */
export const create = async (data) => {
    const id = uuidV4()
    const file = {
        id,
        userId: data.userId,
        filename: data.filename,
        size: data.size,
        mime: data.mime,
    }
    await db.files.create(file)
    return file
}

export const getById = async (id) => {
    const file = await db.files.findByPk(id)
    if (file) {
        return file
    }
    return null
}

export const update = async (fileId, fields) => {
    return await db.files.update(fields, {where: {id: fileId}})
}

export const deleteById = async (fileId) => {
    const file = await db.files.findByPk(fileId)
    if (file) {
        await db.files.destroy({ where: {id: fileId} })
    }
}
