
require('dotenv').config()
const app = require('./app')

// constants
const PORT = process.env.PORT || 8000
const HOST = 'localhost'

const start = async () => {
    try {
        app.listen(PORT, () => { console.log(`Running on http://${HOST}:${PORT}/`) })
    } catch (e) {
        console.log(e)
    }
}

process.on('SIGINT', () => {
    console.log('\nGracefully shutting down!')
    process.exit(1)
})


start()
