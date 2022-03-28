const email = require('../lib/email')

exports.sendEmail = async (req, res) => {
    const userEmail = req.body.email
    const subject  = req.body.subject
    const text = req.body.text

    if (!userEmail || !subject || !text) {
        throw new Error('Email, subject and text are required fields!')
    }

    await email.sendEmail(userEmail, subject, text)

    return res.json({ message: 'OK' })
}
