const dal = require('../dal')
const files = require('../lib/files')


exports.createOrUpdateDictionary = async (req, res) => {
    const userId = req.params.userId
    const dictionaryId = req.body.dictionaryId || null
    const name = req.body.name
    if(!name) {
        return console.log(new Error('name is required!'))
    }

    if (dictionaryId) {
        await dal.dictionaries.update(userId, dictionaryId, name)
        return res.json({dictionaryId, name})
    }
    const dictionary = await dal.dictionaries.create(userId, name)
    res.json(dictionary)
}

exports.getDictionaries = async (req, res) => {
    const userId = req.params.userId
    const dictionaries = await dal.dictionaries.getByUserId(userId)
    res.json(dictionaries)
}

exports.deleteDictionary = async (req, res) => {
    const id = req.params.dictionaryId
    await dal.dictionaries.deleteById(id)
    await dal.entries.deleteByDictionaryId(id)
    res.json({id})
}

exports.updateDictionary = async (req, res) => {
    // const userId = req.params.userId
    const {dictionaryId, name} = req.body
    if(!dictionaryId || !name) {
        return console.log(new Error('dictionaryId and name is required!'))
    }

    const fields = {
        name,
    }
    const dictionary = await dal.dictionaries.updateDictionary(dictionaryId, fields)
    res.json(dictionary)
}

exports.shareDictionary = async (req, res) => {
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
    res.json({message: "OK"})
}

exports.importDictionary = async (req, res) => {
    const userId = req.params.userId

    const newDictionary = await dal.dictionaries.create(userId, req.file.originalname.split('.')[0])
    const entries = await files.getDataFromImportedFile(req.file.path)
    if(entries) {
        for(const entry of entries) {
            await dal.entries.create(newDictionary.id, entry[0], entry[1])
        }
    }
    res.json({message: "OK"})
}


