'use strict'

import events from 'events'
import * as dal from '../dal/index.js'

const emitter = new events.EventEmitter()


export const newNotification = async (req, res) => {
    const {
        senderId,
        recipientId,
        type,
        data
    } = req.body

    // Check if exist
    if (await dal.notifications.checkFriendRequestIsSent(senderId, recipientId)) {
        return res.status(500).json({ error: 'Friend request already sent!' })
    }

    const notification = await dal.notifications.create({
        senderId: senderId,
        recipientId: recipientId,
        type: type,
        data: { message: data.message, senderImageUrl: data.senderImageUrl, dictionaryId: data.dictionaryId }
    })
    console.log(`Created a new notification: ${JSON.stringify(notification)}`)

    emitter.emit('newMessage', notification)
    return res.json(notification)
}

export const getNotifications = (req, res) => {
    res.writeHead(200, {
        'Connection': 'keep-alive',
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
    })
    emitter.on('newMessage', (data) => {
        res.write(`data: ${JSON.stringify(data)} \n\n`)
    })
}

export const getStoredNotifications = async (req, res) => {
    const notifications = await dal.notifications.getByRecipientId(req.params.userId)
    return res.json(notifications)
}

export const deleteStoredNotification = async (req, res) => {
    const { notificationId } = req.params
    await dal.notifications.deleteById(notificationId)
    res.json({ message: 'OK' })
}
