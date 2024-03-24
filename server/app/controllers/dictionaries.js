'use strict'

import * as dal from '../dal/index.js'
import * as files from '../lib/files.js'


export const createOrUpdateDictionary = async (req, res) => {
    const userId = req.params.userId
    const dictionaryId = req.body.dictionaryId || null
    const name = req.body.name
    if(!name) {
        return console.log(new Error('name is required!'))
    }

    if (dictionaryId) {
        await dal.dictionaries.update(dictionaryId, {name})
        return res.json({dictionaryId, name})
    }
    const dictionary = await dal.dictionaries.create(userId, name)
    res.json(dictionary)
}

export const getDictionaries = async (req, res) => {
    const userId = req.params.userId
    const dictionaries = await dal.dictionaries.getByUserId(userId)
    res.json(dictionaries)
}

export const getDictionary = async (req, res) => {
    const dictionaryId = req.params.dictionaryId
    const dictionary = await dal.dictionaries.getById(dictionaryId)
    res.json(dictionary)
}

export const deleteDictionary = async (req, res) => {
    const id = req.params.dictionaryId
    await dal.dictionaries.deleteById(id)
    await dal.entries.deleteAllByDictionaryId(id)
    res.json({id})
}

export const updateDictionary = async (req, res) => {
    // const userId = req.params.userId
    const {dictionaryId, name} = req.body
    if(!dictionaryId || !name) {
        return console.log(new Error('dictionaryId and name is required!'))
    }

    const fields = {
        name,
    }
    const dictionary = await dal.dictionaries.update(dictionaryId, fields)
    res.json(dictionary)
}

export const shareDictionary = async (req, res) => {
    // const userId = req.params.userId
    const {recipientId, dictionaryId} = req.body

    const newDictionary = await dal.dictionaries.copyDictionary(recipientId, dictionaryId)

    const entries = await dal.entries.getByDictionaryId(dictionaryId)
    if(entries) {
        for(let entry of entries) {
            // TODO make {data} object instead of key and value
            await dal.entries.create(newDictionary.id, entry.key, entry.value)
        }
    }
    res.json({message: 'OK'})
}

export const importDictionary = async (req, res) => {
    const userId = req.params.userId

    console.log(req.file)
    const newDictionary = await dal.dictionaries.create(userId, req.file.originalname.split('.')[0])
    const entries = await files.getDataFromImportedFile(req.file.path)
    if(entries) {
        for(const entry of entries) {
            await dal.entries.create(newDictionary.id, entry[0], entry[1])
        }
    }
    res.json({message: 'OK'})
}


