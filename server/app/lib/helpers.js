'use strict'

import fs from 'fs'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'
import * as dal from '../dal/index.js'
import { firebaseConfig } from '../config.js'


export const createRandomCode = (digits) => {
    return () => Math.floor(Math.random() * 9 * Math.pow(10, digits - 1)) + Math.pow(10, digits - 1)
}

export const createRandomUserName = () => {
    return `user_${createRandomCode(12)()}`.toString()
}

export const createUniqueRandomName = async () => {
    const newName = createRandomUserName()
    const nameExisted = await dal.users.getByName(newName)
    if (!nameExisted) {
        return newName
    }
    return createUniqueRandomName()
}


export const createJsonFileConfig = () => {
    const __filename = fileURLToPath(import.meta.url)
    const __dirname = dirname(__filename)

    const jsonContent = JSON.stringify(firebaseConfig, null, 2)
    const filePath = resolve(__dirname, '../../firebaseKey.json')

    fs.writeFileSync(filePath, jsonContent, 'utf-8')
}
