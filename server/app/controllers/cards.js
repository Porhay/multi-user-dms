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

    const card = await dal.cards.create(dictionaryId, key, value)
    console.log(card)
    res.json({message: 'OK'})
}


exports.getCards = async (req, res) => {
    const dictionaryId = req.params.dictionaryId
    const cards = await dal.cards.getByDictionaryId(dictionaryId)
    res.json(cards)
}

exports.getRandomOne = async (req, res) => {
    const dictionaryId = req.params.dictionaryId
    const rows = await dal.cards.getByDictionaryId(dictionaryId)
    return res.json(_randomOne(rows))
}


