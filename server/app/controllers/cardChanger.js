const fs = require('fs')
const path = require('path')
const regexes = require('../lib/regexes')


const filePath = path.resolve('../../persistent/exported/', 'smart-book.txt')

const separator = (data, separator = 'tab') => {
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

fs.readFile(filePath, 'utf8' , (err, data) => {
    if (err) {
        console.log(`Error: Read file error, file path: ${filePath}`)
        return err
    }

    const separatedByTub = separator(data)
    const randomItem = separatedByTub[Math.floor(Math.random() * separatedByTub.length)]

    console.log(randomItem)

})
