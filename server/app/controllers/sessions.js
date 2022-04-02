const dal = require('../dal')
const errors = require('../lib/errors')
const hash = require('../lib/hash')

exports.create = async (req, res) => {
    const {email, password} = req.body
    const browser = req.headers['user-agent']
    const ip = req.ip

    if (email == null) {
        throw new errors.BadRequest('email isn\'t provided')
    }
    if (password == null) {
        throw new errors.BadRequest('password isn\'t provided')
    }

    const user = dal.users.getByEmail(email)
    if (!user) {
        throw new errors.NotFound('user does not exist or wrong password')
    }

    const compared = await hash.comparePasswords(password, user.password)
    if (!compared) {
        throw new errors.NotFound('user does not exist or wrong password')
    }



    return res.json('OK')
}

const _login = async (user, req, res) => {
    res.cookie('psp', passphrase, {httpOnly: true, secure: true})
}
