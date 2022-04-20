const dal = require('../dal')

exports.createDictionary = async (req, res) => {
    const userId = req.params.userId
    const name = req.body.name
    if(!name) {
        return console.log(new Error('name is required!'))
    }

    const dictionary = await dal.dictionaries.create(userId, name)
    console.log(dictionary)
    res.json({message: 'OK'})
}

exports.getDictionaries = async (req, res) => {
    const userId = req.params.userId
    const dictionaries = await dal.dictionaries.getByUserId(userId)
    res.json(dictionaries)
}

exports.deleteDictionary = async (req, res) => {
    const dictionaryId = req.params.dictionaryId
    await dal.dictionaries.deleteById(dictionaryId)
    await dal.entries.deleteByDictionaryId(dictionaryId)
    res.json({message: "OK"})
}

// TODO updateDictionary



exports.shareDictionary = async (req, res) => {
    const {userId, dictionaryId, recipientId} = req.params
    console.log(userId, dictionaryId, recipientId)
    await dal.dictionaries.shareDictionary(userId, recipientId, dictionaryId)
    res.json({message: "OK"})
}


