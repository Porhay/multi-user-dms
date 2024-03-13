'use strict'

import * as dal from '../dal/index.js'

export const createEntry = async (req, res) => {
    const dictionaryId = req.params.dictionaryId
    const { key, value } = req.body
    if (!key || !value) {
        throw new Error('key and value is required!')
    }

    const entry = await dal.entries.create(dictionaryId, key, value)
    res.json(entry)
}

export const getEntries = async (req, res) => {
    const dictionaryId = req.params.dictionaryId
    const entries = await dal.entries.getByDictionaryId(dictionaryId)
    res.json(entries)
}

export const deleteEntry = async (req, res) => {
    const { entryId } = req.params
    await dal.entries.deleteById(entryId)
    res.json({ id: entryId })
}

export const updateEntry = async (req, res) => {
    const { entryId } = req.params
    const color = req.body.color || null
    if (!Object.keys(req.body)) {
        return res.status(304)
    }

    await dal.entries.update(entryId, { color })
    return res.json({ id: entryId })
}
