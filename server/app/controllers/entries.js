const dal = require('../dal')

const _randomOne = (arr) => {
    return arr[Math.floor(Math.random() * arr.length)]
}

exports.createEntry = async (req, res) => {
    const dictionaryId = req.params.dictionaryId
    const {key, value} = req.body
    if(!key || !value) {
        throw new Error('key and value is required!')
    }

    const entry = await dal.entries.create(dictionaryId, key, value)
    res.json(entry)
}

exports.getEntries = async (req, res) => {
    const dictionaryId = req.params.dictionaryId
    const entries = await dal.entries.getByDictionaryId(dictionaryId)
    res.json(entries)
}

exports.deleteEntry = async (req, res) => {
    const {entryId} = req.params
    await dal.entries.deleteById(entryId)
    res.json({id: entryId})
}

exports.getRandomOne = async (req, res) => {
    const dictionaryId = req.params.dictionaryId
    const entries = await dal.entries.getByDictionaryId(dictionaryId)
    return res.json(_randomOne(entries))
}

