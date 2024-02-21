'use strict'

import * as firebase from '../lib/firebase.js'


export const fileUpload = async (req, res) => {
    const downloadUrl = await firebase.upload(req.file)

    // TODO: create files table and set fileId into user avatar
    // const user = await dal.users.updateUserFields(req.params.userId, {image: req.file.filename})
    console.log(`db.users.image updated, filename: ${req.file.filename}`)
    res.json({ downloadUrl });
}


export const getSignedUrl = async (req, res) => {
    const downloadUrl = await firebase.getSignedUrl(req.params.fileId)
    res.json({ downloadUrl });
}