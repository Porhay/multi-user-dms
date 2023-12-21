'use strict'

import fs from 'fs'
import path from 'path'
import * as regexes from './regexes.js'


const filePath = path.resolve('../../dev-deploy/persistent/imported-data/', 'smart-book.txt')

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

const getRandomOne = () => {
    fs.readFile(filePath, 'utf8' , (err, data) => {
        if (err) {
            console.log(`Error: Read file error, file path: ${filePath}`)
            return err
        }

        const separatedByTub = _separator(data)
        const randomItem = separatedByTub[Math.floor(Math.random() * separatedByTub.length)]
        console.log(randomItem)
    })
}

getRandomOne()
