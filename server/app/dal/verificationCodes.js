const config = require('../config')
const uuid = require('uuid')
const db = require("../db")

exports.create = async (userId, code) => {
    //== delete previous user's codes
    await exports.deleteAllUserCodes(userId)

    const now = Date.now()
    const row = {
        id: uuid.v4(),
        userId: userId,
        code: code,
        used: false,
        createdAt: now,
        expiresAt: now + config.VERIFICATION_CODE.TTL
    }

    const record = await db.verificationCodes.create(row)
    return record.id
}

exports.getCode = async (userId) => {
    //== find one the latest
    return await db.verificationCodes.findOne({
        where: {userId},
        order: [['createdAt', 'DESC']],
    })
}
exports.deleteAllUserCodes = async (userId) => {
    return await db.verificationCodes.destroy({
        where: {
            userId: userId
        }
    })
}

exports.setAsUsed = async (userId, codeId) => {
    const code = await exports.getCode(userId)
    if(code.expiresAt < Date.now()){
        return null
    }

    await db.verificationCodes.update(
        { used: true },
        { where: { id: codeId} }
    )
    return code.id
}
