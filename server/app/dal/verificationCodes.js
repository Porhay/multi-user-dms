'use strict'

import { v4 as uuidV4 } from 'uuid'
import * as db from '../db.js'
import * as config from '../config.js'

export const create = async (userId, code) => {
    //== delete previous user's codes
    await deleteAllUserCodes(userId)

    const now = Date.now()
    const row = {
        id: uuidV4(),
        userId: userId,
        code: code,
        used: false,
        createdAt: now,
        expiresAt: now + config.VERIFICATION_CODE.TTL
    }

    const record = await db.verificationCodes.create(row)
    return record.id
}

export const getCode = async (userId) => {
    //== find one the latest
    return await db.verificationCodes.findOne({
        where: { userId },
        order: [['createdAt', 'DESC']],
    })
}
export const deleteAllUserCodes = async (userId) => {
    return await db.verificationCodes.destroy({
        where: {
            userId: userId
        }
    })
}

export const setAsUsed = async (userId, codeId) => {
    const code = await getCode(userId)
    if (code.expiresAt < Date.now()) {
        return null
    }

    await db.verificationCodes.update(
        { used: true },
        { where: { id: codeId } }
    )
    return code.id
}
