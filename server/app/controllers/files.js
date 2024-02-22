'use strict'

import * as firebase from '../lib/firebase.js'
import * as dal from '../dal/index.js'


/*
    req.file = {
        fieldname: 'file',
        originalname: 'avatar_high_quality.png',
        encoding: '7bit',
        mimetype: 'image/png',
        destination: 'data/images',
        filename: 'fea60fcd-54c6-4270-80c2-c83e269f393b.png',
        path: 'data/images/fea60fcd-54c6-4270-80c2-c83e269f393b.png',
        size: 386423
    } 
 */
export const fileUpload = async (req, res) => {
    const userId = req.params.userId
    const {mimetype, filename, size} = req.file

    const downloadUrl = await firebase.upload(req.file)

    const file = await dal.files.create({
        userId: userId,
        filename: filename,
        size: size,
        mime: mimetype,
    })

    const user = await dal.users.updateUserFields(userId, {image: file.id})
    res.json({ downloadUrl, fileId: user.image});
}


export const getSignedUrl = async (req, res) => {
    const fileId = req.params.fileId
    if (!fileId) {
        return res.status(500).json('Internal Error')
    }

    const file = await dal.files.getById(fileId)
    if (file) {
        const downloadUrl = await firebase.getSignedUrlByFilename(file.filename)
        return res.json({ downloadUrl });
    }
    res.json({ downloadUrl: null});
}