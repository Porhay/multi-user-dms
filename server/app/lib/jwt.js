
const jwt = require('jsonwebtoken')
const config = require('../config')

exports.generateAccessToken = (id, role) => {
    const payload = {id, role}
    return jwt.sign(payload, config.JWT_TOKEN.SECRET,
        {expiresIn: config.JWT_TOKEN.EXPIRES_IN}, function (err, token) {
        console.log(token)
    })
}

exports.verifyAccessToken = (token) => {
    return jwt.verify(token, config.JWT_TOKEN.SECRET, {}, function(err, token) {
        console.log(token)
    })
}


