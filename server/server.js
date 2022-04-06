
require('dotenv').config()
const app = require('./app')
const {sequelize} = require('./app/db')

// constants
const PORT = process.env.PORT || 8000
const HOST = 'localhost'

const start = async () => {
    try {
        await sequelize.sync()
        app.listen(PORT, () => { console.log(`Running on http://${HOST}:${PORT}/`) })
    } catch (err) {
        console.log(err)
    }
}

process.on('SIGINT', () => {
    console.log('\nGracefully shutting down!')
    process.exit(1)
})


start()
