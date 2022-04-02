const nodemailer = require('nodemailer')
const CONFIG = require('../config')


exports.sendEmail = async (email, subject, text, html = null) => {
    const transporter = nodemailer.createTransport({
        service: CONFIG.SMTP.SERVICE,
        auth: {
            user: CONFIG.SMTP.USER,
            pass: CONFIG.SMTP.PASSWORD
        }
    })

    const mailOptions = {
        from: CONFIG.SMTP.MAILER,
        to: email,
        subject: subject,
        text: text,
        html: html,
        attachments: [],
    }

    await transporter.sendMail(mailOptions, function (err, info) {
        if (err) {
            console.log(err)
        }
        console.log(info)
    })
}

exports.sendVerificationEmail = async (email, code) => {
    const subject = 'Your account verification code'
    const text = `To sign in, enter the following code:\nCode: ${code}\nPlease note, this code will expire in 10 minutes!`
    await exports.sendEmail(email, subject, text)
}
