'use strict'

/* eslint-disable no-async-promise-executor */

import fs from 'fs'
import path from 'path'
import admin from 'firebase-admin'
import { firebaseConfig } from '../config.js'


// Initialize Firebase
admin.initializeApp({
    credential: admin.credential.cert(firebaseConfig),
    storageBucket: firebaseConfig.storageBucket
})
const bucket = admin.storage().bucket()


export const getSignedUrlByFilename = (filename) => {
    return new Promise(async (resolve, reject) => {
        try {
            // Get a reference to the storage service
            const storage = admin.storage()

            // Create a storage reference from our storage service and specify the path to the file
            const fileRef = storage.bucket().file(filename)

            const expirationDate = new Date()
            expirationDate.setDate(expirationDate.getDate() + 1) // Set expiration to 1 day from now

            const url = await fileRef.getSignedUrl({ action: 'read', expires: expirationDate })

            resolve(url)
        } catch (error) {
            console.error('Error generating signed URL:', error)
            reject(error)
        }
    })
}

export const upload = async (file) => {
    try {
        const { filename } = file
        console.log(filename)
        const IMAGES_FOLDER = 'data/images'
        const localFilePath = path.join(IMAGES_FOLDER, filename)

        await bucket.upload(localFilePath, {
            destination: filename,
            metadata: {
                contentType: file.mimetype,
            },
        })

        const downloadUrl = await getSignedUrlByFilename(filename)

        fs.unlink(localFilePath, (err) => err ? console.error('Error deleting local file:', err) :
            console.log('Local file deleted successfully.'))

        return downloadUrl
    } catch (error) {
        console.error('Error uploading avatar:', error)
        return null
    }
}
