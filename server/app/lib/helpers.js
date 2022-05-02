const dal = require('../dal')


exports.createRandomCode = (digits) => {
    return () => Math.floor(Math.random() * 9 * Math.pow(10, digits - 1)) + Math.pow(10, digits - 1)
}


exports.createRandomUserName = () => {
    return `user_${exports.createRandomCode(12)()}`.toString()
}
exports.createUniqueRandomName = async () => {
    const newName = exports.createRandomUserName()
    const nameExisted = await dal.users.getByName(newName)
    if(!nameExisted){
        return newName
    }
    return exports.setUniqueRandomName()
}

