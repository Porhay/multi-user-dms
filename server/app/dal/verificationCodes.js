const config = require('../config')
const uuid = require('uuid')
const db = require("../db")

exports.create = async (userId, code) => {
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
    const result = await db.user.findOne({ where: { userId } })
    if (!result) {
        return null
    }
    return result
}

exports.setAsUsed = async (userId, codeId) => {
    const code = await db.verificationCodes.update(
        { used: true },
        { where: { id: codeId} }
    )
    return code.id
}
