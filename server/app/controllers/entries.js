'use strict'

import * as dal from '../dal/index.js'

export const createEntry = async (req, res) => {
    const dictionaryId = req.params.dictionaryId
    const key = req.body.key
    const value = req.body.value || ''
    if (!key) {
        throw new Error('key is required!')
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
    const { entryId } = req.params;
    const updateFields = {};

    if (req.body.color !== undefined) {
        updateFields.color = req.body.color;
    }
    if (req.body.key !== undefined) {
        updateFields.key = req.body.key;
    }
    if (req.body.value !== undefined) {
        updateFields.value = req.body.value;
    }

    if (Object.keys(updateFields).length === 0) {
        return res.status(304).send(); // Sending status only, no content
    }

    const entry = await dal.entries.update(entryId, updateFields);
    return res.json(entry);
};
