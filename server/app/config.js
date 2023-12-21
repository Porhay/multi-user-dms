'use strict'

export const SMTP = {
    SERVICE: process.env.SMTP_SERVICE,
    USER: process.env.SMTP_USER,
    PASSWORD: process.env.SMTP_PASSWORD,
    MAILER: process.env.SMTP_MAILER
}

export const VERIFICATION_CODE = {
    DIGITS: 6, // digits quantity
    TTL: 60 * 10 * 1000, // 10 min
}

export const JWT_TOKEN = {
    SECRET: 'TOKEN_KEY',
    EXPIRES_IN: '24h',
}

