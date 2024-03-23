'use strict'

import { v4 as uuidV4 } from 'uuid'
import * as db from '../db.js'
import { notificationType } from '../lib/constants.js'


/**
 * Create notification in database
 * @param {senderId, recipientId, data} context
 * @returns
 */
export const create = async (context) => {
    const id = uuidV4()
    const notification = {
        id,
        senderId: context.senderId,
        recipientId: context.recipientId,
        data: context.data,
        type: context.type,
        seen: false,
    }
    await db.notifications.create(notification)
    return notification
}

export const getById = async (id) => {
    const notification = await db.notifications.findByPk(id)
    if (notification) {
        return notification
    }
    return null
}

export const update = async (id, fields) => {
    return await db.notifications.update(fields, { where: { id: id } })
}

export const deleteById = async (id) => {
    const notification = await db.notifications.findByPk(id)
    if (notification) {
        await db.notifications.destroy({ where: { id: id } })
    }
}


export const getByRecipientId = async (recipientId) => {
    const result = await db.notifications.findAll({ where: { recipientId: recipientId } })
    if (!result || result.length === 0) {
        return null
    }
    return result
}

export const checkFriendRequestIsSent = async (senderId, recipientId) => {
    const result = await db.notifications.findAll({
        where: {
            senderId: senderId,
            recipientId: recipientId,
            type: notificationType.friendRequest
        }
    })

    if (!result || result.length === 0) {
        return null
    }
    return result
}
