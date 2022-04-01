const dal = require('../dal')

exports.registration = async (req, res) => {
    const {email, password} = req.body

    if(!email) {
        throw new Error('Email is required!')
    }
    if(!password) {
        throw new Error('Password is required!')
    }

    // check for existence
    const candidate = await dal.users.getByEmail(email)
    if(candidate){
        throw new Error('User with the same email is already exists!')
    }

    const user = await dal.users.create(email, password)
    return res.json(user.id)
}

exports.getUsers = async (req, res) => {
    const users = await dal.users.getAll()
    res.json(users)
}

exports.deleteOne = async (req, res) => {
    const userId = req.params.userId
    await dal.users.deleteById(userId)
    res.json({message: "OK"})
}

