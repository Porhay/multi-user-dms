'use strict'

import * as dal from '../dal/index.js'
import * as email from '../lib/email.js'
import * as config from '../config.js'
import * as helpers from '../lib/helpers.js'


export const create = async (req, res) => {
    const user = await dal.users.getById(req.params.userId)

    //= create code, save to db, send by email
    const code = helpers.createRandomCode(config.VERIFICATION_CODE.DIGITS)().toString()
    const id = await dal.verificationCodes.create(user.id, code)
    await email.sendVerificationEmail(user.email, code)

    return res.json({id})
}

export const setAsUsed = async (req, res) => {
    const {userId, codeId} = req.params

    const used = await dal.verificationCodes.setAsUsed(userId, codeId)
    if(!used) {
        return res.json({message: 'Code has expired'})
    }
    return res.json({message: 'OK'})
}
