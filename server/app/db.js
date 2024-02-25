'use strict'

import { DataTypes, Sequelize } from 'sequelize'
import * as constants from './lib/constants.js'
import { DATABASE_URL } from './config.js'


export const sequelize = new Sequelize(
    DATABASE_URL, {
    dialect: 'postgres',
    ssl: process.env.DB_ENABLE_SSL, // Enable SSL for secure connections
    dialectOptions: {
        ssl: process.env.DB_ENABLE_SSL && {
            require: true,
            rejectUnauthorized: false, // Disable SSL certificate validation
        }
    },
}
);

export const users = sequelize.define('users', {
    id: { type: DataTypes.UUID, primaryKey: true, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false },
    emailVerified: { type: DataTypes.BOOLEAN, defaultValue: false },
    username: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false },
    role: { type: DataTypes.STRING, defaultValue: constants.USER_ROLES.USER },
    friends: { type: DataTypes.JSON, defaultValue: [] },
    name: { type: DataTypes.STRING },
    image: { type: DataTypes.STRING },
}, { underscored: true })


export const verificationCodes = sequelize.define('verificationCodes', {
    id: { type: DataTypes.UUID, primaryKey: true, allowNull: false },
    userId: { type: DataTypes.UUID, allowNull: false },
    code: { type: DataTypes.STRING },
    used: { type: DataTypes.BOOLEAN, defaultValue: false },
    createdAt: { type: DataTypes.TEXT },
    expiresAt: { type: DataTypes.TEXT }
}, { underscored: true, updatedAt: false, createdAt: false })


export const dictionaries = sequelize.define('dictionaries', {
    id: { type: DataTypes.UUID, primaryKey: true, allowNull: false },
    userId: { type: DataTypes.UUID, allowNull: false },
    name: { type: DataTypes.TEXT, defaultValue: 'My dictionary' },
    type: { type: DataTypes.TEXT, defaultValue: constants.DICTIONARY_TYPES.STANDARD },
    count: { type: DataTypes.INTEGER, defaultValue: 0 },
}, { underscored: true })


export const entries = sequelize.define('entries', {
    id: { type: DataTypes.UUID, primaryKey: true, allowNull: false },
    dictionaryId: { type: DataTypes.UUID, allowNull: false },
    key: { type: DataTypes.TEXT },
    value: { type: DataTypes.TEXT },
    image: { type: DataTypes.STRING },
}, { underscored: true })

export const files = sequelize.define('files', {
    id: { type: DataTypes.UUID, primaryKey: true, allowNull: false },
    userId: { type: DataTypes.UUID, allowNull: false },
    filename: { type: DataTypes.STRING },
    size: { type: DataTypes.INTEGER, defaultValue: 0 },
    mime: { type: DataTypes.TEXT },
}, { underscored: true })

export const notifications = sequelize.define('notifications', {
    id: { type: DataTypes.UUID, primaryKey: true, allowNull: false },
    senderId: { type: DataTypes.UUID, allowNull: false },
    recipientId: { type: DataTypes.UUID, allowNull: false },
    type: { type: DataTypes.STRING },
    data: { type: DataTypes.JSON, defaultValue: {} }, // {message, dictionaryId, senderImageUrl}
    seen: { type: DataTypes.BOOLEAN, defaultValue: false },
}, { underscored: true })
