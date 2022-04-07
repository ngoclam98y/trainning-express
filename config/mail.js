const nodemailer = require('nodemailer');
const dotenv = require('dotenv');

dotenv.config();

const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
    }
});


module.exports.sendMail = function ({ to, subject, html }) {

    const mailOptions = {
        to,
        from: process.env.FROM_EMAIL,
        subject,
        html
    };

    return new Promise((res, rej) => {
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                rej(error);
            } else {
                res('Email sent: ' + info.response)
            }
        });
    })

}