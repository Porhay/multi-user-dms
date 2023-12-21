'use strict'

import fs from 'fs'
import * as regexes from './regexes.js'


const _separator = (data, separator = 'tab') => {
    const newLineSeparated = data.split(regexes.newLineSeparation)

    if(separator === 'tab') {
        let array = []
        for (let line of newLineSeparated) {
            const byTub = line.split(regexes.byTubSeparation)
            if(byTub.length === 2) {
                array.push(byTub)
            }
        }
        return array
    }
}

export const getDataFromImportedFile = async (path) => {
    try {
        let data = await fs.promises.readFile(path, 'utf8')
        data = _separator(data)
        return data
    } catch (err) {
        console.log(err)
    }
}
