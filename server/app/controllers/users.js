const dal = require('../dal')
const jwt = require('../lib/jwt')
const errors = require('../lib/errors')
const hash = require('../lib/hash')


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

    const user = await dal.users.create(email, password)
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

