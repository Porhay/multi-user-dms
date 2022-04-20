

exports.createRandomCode = (digits) => {
    return () => Math.floor(Math.random() * 9 * Math.pow(10, digits - 1)) + Math.pow(10, digits - 1)
}

exports.createRandomUserName = () => {
    return `user_${exports.createRandomCode(12)()}`.toString()
}

