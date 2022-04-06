const jwt = require('jsonwebtoken')
const config = require('../config')

exports.createRandomCode = (digits) => {
    return () => Math.floor(Math.random() * 9 * Math.pow(10, digits - 1)) + Math.pow(10, digits - 1)
}

exports.generateAccessToken = (id, role) => {
    const payload = { id, role }
    return jwt.sign(payload, config.JWT_TOKEN.SECRET,
        {expiresIn: config.JWT_TOKEN.EXPIRES_IN }, function(err, token) {
        console.log(token)
    })
}
