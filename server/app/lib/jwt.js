'use strict'

import  jwt from 'jsonwebtoken'
import * as config from '../config.js'


export const generateAccessToken = (id, role) => {
    const payload = {id, role}
    return jwt.sign(payload, config.JWT_TOKEN.SECRET, {expiresIn: config.JWT_TOKEN.EXPIRES_IN})
}

export const verifyAccessToken = (token) => {
    return jwt.verify(token, config.JWT_TOKEN.SECRET, {})
}

