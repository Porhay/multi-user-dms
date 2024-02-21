'use strict'

import * as dal from '../dal/index.js'


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

