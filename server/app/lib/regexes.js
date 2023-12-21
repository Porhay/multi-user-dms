'use strict'

/**
 * \s    -  matches any whitespace character.
 * {2,}  -  matches the previous token between 2 and unlimited times, as many times as possible.
 * @type {RegExp}
 */
export const byTwoSpaceUpperSeparation = /\s{2,}/g

export const byTubSeparation = /\t/g

export const bySpaceSeparation = /\s/g

export const newLineSeparation = /\n/g

