
require('dotenv').config()
const app = require('./app')

// constants
const PORT = process.env.PORT || 8000


const start = async () => {
    try {
        app.listen(PORT, () => { console.log(`Server has been started on port ${PORT}...`) })
    } catch (e) {
        console.log(e)
    }
}

process.on('SIGINT', () => {
    console.log('\nGracefully shutting down!')
    process.exit(1)
})


start()
