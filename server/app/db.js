'use strict'

import {DataTypes, Sequelize} from 'sequelize'
import * as constants from './lib/constants.js'


export const sequelize = new Sequelize(
    process.env.DB_NAME || 'root',
    process.env.DB_USER || 'root',
    process.env.DB_PASSWORD || 'root',
    {
        dialect: 'postgres',
        host: process.env.LOCALHOST || process.env.REMOUTE_HOST || '0.0.0.0',
        port: parseInt(process.env.DB_PORT || '5432')
    }
)

export const user = sequelize.define('user', {
    id: {type: DataTypes.UUID, primaryKey: true, allowNull: false},
    email: {type: DataTypes.STRING, allowNull: false},
    emailVerified: {type: DataTypes.BOOLEAN, defaultValue: false},
    username: {type: DataTypes.STRING, allowNull: false, unique: true},
    password: {type: DataTypes.STRING, allowNull: false},
    role: {type: DataTypes.STRING, defaultValue: constants.USER_ROLES.USER},
    friends: {type: DataTypes.JSON, defaultValue: []},
    name: {type: DataTypes.STRING},
    image: {type: DataTypes.STRING},
}, {underscored: true})


export const verificationCodes = sequelize.define('verificationCodes', {
    id: {type: DataTypes.UUID, primaryKey: true, allowNull: false},
    userId: {type: DataTypes.UUID, allowNull: false},
    code: {type: DataTypes.STRING},
    used: {type: DataTypes.BOOLEAN, defaultValue: false},
    createdAt: {type: DataTypes.TEXT},
    expiresAt: {type: DataTypes.TEXT}
}, {underscored: true, updatedAt: false, createdAt: false})


export const dictionaries = sequelize.define('dictionaries', {
    id: {type: DataTypes.UUID, primaryKey: true, allowNull: false},
    userId: {type: DataTypes.UUID, allowNull: false},
    name: {type: DataTypes.TEXT, defaultValue: 'My dictionary'},
    type: {type: DataTypes.TEXT, defaultValue: constants.DICTIONARY_TYPES.STANDARD},
    count: {type: DataTypes.INTEGER, defaultValue: 0},
}, {underscored: true})


export const entries = sequelize.define('entries', {
    id: {type: DataTypes.UUID, primaryKey: true, allowNull: false},
    dictionaryId: {type: DataTypes.UUID, allowNull: false},
    key: {type: DataTypes.TEXT},
    value: {type: DataTypes.TEXT},
    image: {type: DataTypes.STRING},
}, {underscored: true})
