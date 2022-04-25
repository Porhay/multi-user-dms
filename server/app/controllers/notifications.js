const events = require('events')
const uuid = require('uuid')


const emitter = new events.EventEmitter()

exports.newNotification = (req, res) => {
    let data = req.body
    data.id = uuid.v4()
    emitter.emit('newMessage', data)
    return res.json(data)
}

exports.getNotifications = (req, res) => {
    res.writeHead(200, {
        'Connection': 'keep-alive',
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
    })
    emitter.on('newMessage', (data) => {
        res.write(`data: ${JSON.stringify(data)} \n\n`)
    })
}
