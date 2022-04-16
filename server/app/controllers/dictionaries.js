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

// TODO deleteDictionary, updateDictionary

