
/**
 * \s    -  matches any whitespace character.
 * {2,}  -  matches the previous token between 2 and unlimited times, as many times as possible.
 * @type {RegExp}
 */
const byTwoSpaceUpperSeparation = /\s{2,}/g

const byTubSeparation = /\t/g

const bySpaceSeparation = /\s/g

const newLineSeparation = /\n/g


module.exports = {
    byTwoSpaceUpperSeparation,
    byTubSeparation,
    bySpaceSeparation,
    newLineSeparation
}


