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


const user = sequelize.define('user', {
    id: {type: DataTypes.UUID, primaryKey: true, allowNull: false},
    email: {type: DataTypes.STRING, allowNull: false},
    emailVerified: {type: DataTypes.BOOLEAN, defaultValue: false},
    password: {type: DataTypes.STRING, allowNull: false},
    role: {type: DataTypes.STRING, defaultValue: 'USER'},
    name: {type: DataTypes.STRING},
    img: {type: DataTypes.STRING},
}, {underscored: true})


const verificationCodes = sequelize.define('verificationCodes', {
    id: {type: DataTypes.UUID, primaryKey: true, allowNull: false},
    userId: {type: DataTypes.UUID, allowNull: false},
    code: {type: DataTypes.STRING},
    used: {type: DataTypes.BOOLEAN, defaultValue: false},
    createdAt: {type: DataTypes.TEXT},
    expiresAt: {type: DataTypes.TEXT}
}, {underscored: true, updatedAt: false, createdAt: false})


module.exports = {
    sequelize,
    user,
    verificationCodes,
}
