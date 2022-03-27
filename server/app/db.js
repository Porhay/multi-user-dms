const {DataTypes, Sequelize} = require('sequelize')

const sequelize = new Sequelize(
    process.env.DB_NAME || 'dms',
    process.env.DB_USER || 'root',
    process.env.DB_PASSWORD || 'root',
    {
        dialect: 'postgres',
        host: process.env.DB_HOST || '0.0.0.0' || "localhost",
        port: parseInt(process.env.DB_PORT || '5432')
    }
)


//= User Table
const user = sequelize.define('user', {
    id: {type: DataTypes.UUID, primaryKey: true, allowNull: false},
    email: {type: DataTypes.STRING, allowNull: false},
    emailVerified: {type: DataTypes.BOOLEAN, defaultValue: false},
    password: {type: DataTypes.STRING, allowNull: false},
    role: {type: DataTypes.STRING, defaultValue: 'USER'},
    name: {type: DataTypes.STRING},
    img: {type: DataTypes.STRING},
})

// const Task = sequelize.define('task', {
//     id: {type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true},
//     task: {type: DataTypes.STRING},
// })
//
// User.hasMany(Task)
// Task.belongsTo(User)


module.exports = {
    sequelize,
    user,
}
