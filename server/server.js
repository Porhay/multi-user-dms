'use strict'

import 'dotenv/config'
import {app} from './app/index.js'
import {sequelize} from './app/db.js'
import {PORT, HOST} from './app/config.js'

const start = async () => {
    try {
        console.log('Database name:', sequelize.getDatabaseName());
        sequelize.sync()
        app.listen(PORT, () => { console.log(`Running on http://${HOST}:${PORT}/`) })
    } catch (err) {
        console.log(err.message)
    }
}

process.on('SIGINT', () => {
    console.log('\nGracefully shutting down!')
    process.exit(1)
})


start()
