const dal = require('../dal')
const helpers = require('../lib/helpers')
const errors = require('../lib/errors')
const hash = require('../lib/hash')


exports.create = async (req, res) => {
    const {email, password} = req.body

    if(!email) {
        throw new Error('Email is required!')
    }
    if(!password) {
        throw new Error('Password is required!')
    }

    // check for existence
    const candidate = await dal.users.getByEmail(email)
    if(candidate){
        throw new Error('User with the same email is already exists!')
    }

    const user = await dal.users.create(email, password)
    return res.json({id: user.id})
}


exports.signIn = async (req, res) => {
    const {email, password} = req.body
    const browser = req.headers['user-agent']
    const ip = req.ip

    if (email == null) {
        throw new errors.BadRequest('email isn\'t provided')
    }
    if (password == null) {
        throw new errors.BadRequest('password isn\'t provided')
    }

    const user = await dal.users.getByEmail(email)
    if (!user) {
        throw new errors.NotFound('user does not exist or wrong password')
    }

    const compared = await hash.comparePasswords(password, user.password)
    if (!compared) {
        throw new errors.NotFound('user does not exist or wrong password')
    }

    const token = helpers.generateAccessToken(user.id, user.role)
    return res.json('OK')
}


const _login = async (user, req, res) => {
    res.cookie('psp', passphrase, {httpOnly: true, secure: true})
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

