'use strict'

import events from 'events'
import {v4 as uuidV4} from 'uuid'


const emitter = new events.EventEmitter()

export const newNotification = (req, res) => {
    let data = req.body
    data.id = uuidV4()
    emitter.emit('newMessage', data)
    return res.json(data)
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
