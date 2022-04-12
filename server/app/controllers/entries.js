const dal = require('../dal')

const _randomOne = (arr) => {
    return arr[Math.floor(Math.random() * arr.length)]
}

exports.create = async (req, res) => {
    const dictionaryId = req.params.dictionaryId
    const {key, value} = req.body
    if(!key || !value) {
        throw new Error('key and value is required!')
    }

    const entry = await dal.entries.create(dictionaryId, key, value)
    console.log(entry)
    res.json({message: 'OK'})
}


exports.getCards = async (req, res) => {
    const dictionaryId = req.params.dictionaryId
    const entries = await dal.entries.getByDictionaryId(dictionaryId)
    res.json(entries)
}

exports.getRandomOne = async (req, res) => {
    const dictionaryId = req.params.dictionaryId
    const entries = await dal.entries.getByDictionaryId(dictionaryId)
    return res.json(_randomOne(entries))
}


