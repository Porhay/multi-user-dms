const dal = require('../dal')
const jwt = require('../lib/jwt')
const errors = require('../lib/errors')
const hash = require('../lib/hash')
const helpers = require('../lib/helpers')


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

    const name = await helpers.createUniqueRandomName()
    const username = await helpers.createUniqueRandomName()
    const user = await dal.users.create(email, password, name, username)

    // default user's dictionary with entries
    const dictionary = await dal.dictionaries.create(user.id, 'Get Started')
    await dal.entries.create(dictionary.id, 'some word', 'some translation')

    return res.json({id: user.id})
}


exports.login = async (req, res) => {
    const {email, password} = req.body
    // const browser = req.headers['user-agent']
    // const ip = req.ip

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
    return res.json({token, user})
}

exports.check = async (req, res) => {
    const token = jwt.generateAccessToken(req.user.id, req.user.role)
    const user = await dal.users.getById(req.user.id)
    user.password = null
    return res.json({token, user})
}


exports.getUsers = async (req, res) => {
    const users = await dal.users.getAll()
    res.json(users)
}

exports.getUser = async (req, res) => {
    const userId = req.params.userId
    const user = await dal.users.getById(userId)
    user.password = null
    res.json(user)
}

exports.deleteOne = async (req, res) => {
    const userId = req.params.userId
    await dal.users.deleteById(userId)
    res.json({message: "OK"})
}

exports.updateProfile = async (req, res) => {
    const userId = req.params.userId

    /**
     * fields: {name, city, theme...}
     */
    const fields = req.body.fields
    await dal.users.updateUserFields(userId, fields)
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


exports.uploadProfileImage = async (req, res) => {
    const userId = req.params.userId
    // TODO merge with updateProfile
    try {
        const user = await dal.users.updateUserFields(userId, {image: req.file.filename})
        console.log(`db.users.image updated, filename: ${req.file.filename}`)
        res.json({image: user.image})
    } catch (err) {
        console.log(err)
    }
}

