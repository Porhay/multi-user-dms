const dal = require('../dal')
const jwt = require('../lib/jwt')
const errors = require('../lib/errors')
const hash = require('../lib/hash')
const helpers = require("../lib/helpers");


exports.create = async (req, res) => {
    const {email, password} = req.body

    if(!email) {
        return console.log(new Error('Email is required!'))
    }
    if(!password) {
        return console.log(new Error('Password is required!'))
    }

    // check for existence
    const candidate = await dal.users.getByEmail(email)
    if(candidate){
        return console.log(new Error('User with the same email is already exists!'))
    }

    const setUniqueRandomName = async () => {
        const newName = helpers.createRandomUserName()
        const nameExisted = await dal.users.getByName(newName)
        if(!nameExisted){
            return newName
        }
        return setUniqueRandomName()
    }
    const name = await setUniqueRandomName()

    const user = await dal.users.create(email, password, name)

    // default user's dictionary with entries
    const dictionary = await dal.dictionaries.create(user.id, 'Get Started')
    const entries = await dal.entries.create(dictionary.id, 'some word', 'some translation')

    return res.json({id: user.id})
}


exports.login = async (req, res) => {
    const {email, password} = req.body
    const browser = req.headers['user-agent']
    const ip = req.ip

    if (email == null) {
        return console.log(new errors.BadRequest('email isn\'t provided'))
    }
    if (password == null) {
        return console.log(new errors.BadRequest('password isn\'t provided'))
    }

    const user = await dal.users.getByEmail(email)
    if (!user) {
        return console.log(new errors.NotFound('user does not exist or wrong password'))
    }

    const compared = await hash.comparePasswords(password, user.password)
    if (!compared) {
        return console.log(new errors.NotFound('user does not exist or wrong password'))
    }

    const token = jwt.generateAccessToken(user.id, user.role)
    res.json({token})
}

exports.check = async (req, res) => {
    const token = jwt.generateAccessToken(req.user.id, req.user.role)
    return res.json({token})
}


exports.getUsers = async (req, res) => {
    const users = await dal.users.getAll()
    res.json(users)
}

exports.deleteOne = async (req, res) => {
    const userId = req.params.userId
    await dal.users.deleteById(userId)
    res.json({message: "OK"})
}

exports.getFriends = async (req, res) => {
    const userId = req.params.userId
    const user = await dal.users.getById(userId)

    let friends = []
    for (let userId of user.friends) {
        const friend = await dal.users.getById(userId)
        friends.push({id: userId, name: friend.name})
    }

    res.json(friends)
}

