'use strict'

import bcrypt from 'bcryptjs'

export const hashPassword = async (password) => {
    return await bcrypt.hashSync(password, 7)
}

export const comparePasswords = async (password, hash) => {
    return await bcrypt.compare(password, hash)
}
