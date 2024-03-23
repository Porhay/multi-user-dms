'use strict'

/* eslint-disable camelcase */
/* eslint-disable max-len */

export const isProduction = process.env.NODE_ENV === 'production'

export const PORT = process.env.PORT || 8000
export const HOST = process.env.HOST || 'localhost'

// Render.com provides a DATABASE_URL environment variable
export const DATABASE_URL = isProduction ? process.env.DATABASE_URL : 'postgres://root:root@localhost:5432/root'

export const firebaseConfig = {
    storageBucket: process.env.storageBucket || 'gs://into-the-shelter.appspot.com',
    type: 'service_account',
    project_id: 'into-the-shelter',
    private_key_id: process.env.private_key_id,
    private_key: process.env.private_key,
    client_email: 'firebase-adminsdk-buiok@into-the-shelter.iam.gserviceaccount.com',
    client_id: '100916296756280661809',
    auth_uri: 'https://accounts.google.com/o/oauth2/auth',
    token_uri: 'https://oauth2.googleapis.com/token',
    auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
    client_x509_cert_url: 'https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-buiok%40into-the-shelter.iam.gserviceaccount.com',
    universe_domain: 'googleapis.com'
}


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
    SECRET: process.env.JWT_TOKEN_SECRET || 'TOKEN_KEY',
    EXPIRES_IN: '48h',
}

