'use strict'

import 'dotenv/config'
import {app} from './app/index.js'
import {sequelize} from './app/db.js'

// constants
const PORT = process.env.PORT || 8000
const HOST = 'localhost' || process.env.REMOUTE_HOST

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
