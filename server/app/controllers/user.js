const dal = require('../dal')

class User {
    async registration(req, res) {
        try {
            const {email, password} = req.body
            const newUser = await dal.user.create(email, password)
            return res.json(newUser)
        } catch (err) {
            console.log(err)
            res.status(400).json({message: 'Registration error'})
        }
    }

    async getUsers(req, res) {
        try {
            const users = await dal.user.getAll()
            res.json(users)
        } catch (err) {
            console.log(err)
            res.status(400).json({message: 'Get Users error'})
        }
    }

    async deleteOne(req, res) {
        try {
            const userId = req.params.userId
            const userToDelete = await dal.user.deleteById(userId)
            res.json(userToDelete)
        } catch (err) {
            console.log(err)
            res.status(400).json({message: 'Delete user error'})
        }
    }
}

module.exports = new User()
