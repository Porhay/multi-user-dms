const {user} = require('../db')
const bcrypt = require('bcryptjs')


class User {
    async registration(req, res) {
        try {
            const {email, password} = req.body

            // const candidate = await user.findOne({ where: {email} })
            // if(candidate){
            //     return res.status(400).json('This user name is already taken. Please use different one.')
            // }

            const hashPassword = bcrypt.hashSync(password, 7)
            await user.create({email, password: hashPassword})
            return res.json({message: 'User has been successfully registered!'})
        } catch (err) {
            console.log(err)
            res.status(400).json({message: 'Registration error'})
        }
    }

    async getUsers(req, res) {
        try {
            const users = await user.findAll()
            res.json(users)
        } catch (err) {
            console.log(err)
            res.status(400).json({message: 'Get Users error'})
        }
    }

    async deleteOne(req, res) {
        try {
            const id = req.params.id
            const userToDelete = await user.destroy({
                where: {
                    id: id
                }
            })
            res.json(userToDelete)
        } catch (err) {
            console.log(err)
            res.status(400).json({message: 'delete user error'})
        }
    }
}

module.exports = new User()
