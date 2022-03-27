'use strict'

const bcrypt = require("bcryptjs")

exports.hashPassword = async (password) => {
    return await bcrypt.hashSync(password, 7)
}

exports.comparePasswords = async (password, hash) => {
    return await bcrypt.compare(password, hash)
}
